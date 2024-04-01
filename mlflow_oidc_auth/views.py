import logging
import os
import requests
import secrets
import string
from typing import Callable, Union
from werkzeug.datastructures import Authorization

from flask import (
    make_response,
    request,
    redirect,
    render_template,
    Response,
    session,
    send_from_directory,
    url_for,
    jsonify,
)

from mlflow import MlflowException
from mlflow.protos.databricks_pb2 import (
    BAD_REQUEST,
    ErrorCode,
    INVALID_PARAMETER_VALUE,
    RESOURCE_DOES_NOT_EXIST,
)
from mlflow.protos.service_pb2 import (
    CreateExperiment,
)
from mlflow.server.auth.permissions import Permission, get_permission
from mlflow.server.handlers import (
    catch_mlflow_exception,
    get_endpoints,
)

from mlflow.tracking import MlflowClient
from oauthlib.oauth2 import WebApplicationClient

from mlflow_oidc_auth import routes
from mlflow_oidc_auth.client import AuthServiceClient
from mlflow_oidc_auth.config import AppConfig
from mlflow_oidc_auth.sqlalchemy_store import SqlAlchemyStore

# Create the OAuth2 client
auth_client = WebApplicationClient(AppConfig.get_property("OIDC_CLIENT_ID"))
# mlflow_auth_client = AuthServiceClient(os.environ.get("TRACKING_URI"))
mlflow_client = MlflowClient()
store = SqlAlchemyStore()
store.init_db((AppConfig.get_property("DATABASE_URI")))
_logger = logging.getLogger(__name__)


def _get_request_param(param: str) -> str:
    if request.method == "GET":
        args = request.args
    elif request.method in ("POST", "PATCH", "DELETE"):
        args = request.json
    else:
        raise MlflowException(
            f"Unsupported HTTP method '{request.method}'",
            BAD_REQUEST,
        )

    if param not in args:
        # Special handling for run_id
        if param == "run_id":
            return _get_request_param("run_uuid")
        raise MlflowException(
            f"Missing value for required parameter '{param}'. "
            "See the API docs for more information about request parameters.",
            INVALID_PARAMETER_VALUE,
        )
    return args[param]


def _is_unprotected_route(path: str) -> bool:
    return path.startswith(
        ("/static", "/favicon.ico", "/health", "/login", "/callback", "/oidc/static")
    )


def _get_permission_from_store_or_default(
    store_permission_func: Callable[[], str]
) -> Permission:
    """
    Attempts to get permission from store,
    and returns default permission if no record is found.
    """
    try:
        perm = store_permission_func()
    except MlflowException as e:
        if e.error_code == ErrorCode.Name(RESOURCE_DOES_NOT_EXIST):
            perm = AppConfig.get_property("DEFAULT_MLFLOW_PERMISSION")
        else:
            raise
    return get_permission(perm)


def authenticate_request_basic_auth() -> Union[Authorization, Response]:
    username = request.authorization.username
    password = request.authorization.password
    _logger.debug("Authenticating user %s", username)
    if store.authenticate_user(username, password):
        _set_username(username)
        _logger.debug("User %s authenticated", username)
        return True
    else:
        _logger.debug("User %s not authenticated", username)
        # let user attempt login again
        return False


def _get_username():
    return session.get("username")


def _set_username(username):
    session["username"] = username
    return


def _get_permission_from_experiment_id() -> Permission:
    experiment_id = _get_request_param("experiment_id")
    username = _get_username()
    return _get_permission_from_store_or_default(
        lambda: store.get_experiment_permission(experiment_id, username).permission
    )


def _validate_can_manage_experiment():
    # return _get_permission_from_experiment_id().can_manage
    return False


def _get_before_request_handler(request_class):
    return BEFORE_REQUEST_HANDLERS.get(request_class)


BEFORE_REQUEST_HANDLERS = {
    # Routes for experiments
    CreateExperiment: _validate_can_manage_experiment,
}

BEFORE_REQUEST_VALIDATORS = {
    (http_path, method): handler
    for http_path, handler, methods in get_endpoints(_get_before_request_handler)
    for method in methods
}

BEFORE_REQUEST_VALIDATORS.update(
    {
        (routes.CREATE_EXPERIMENT_PERMISSION, "GET"): _validate_can_manage_experiment,
    }
)


def before_request_hook():
    """Called before each request. If it did not return a response,
    the view function for the matched route is called and returns a response"""
    if _is_unprotected_route(request.path):
        return
    if request.authorization is not None:
        if not authenticate_request_basic_auth():
            return make_basic_auth_response()
    else:
        # authentication
        if not _get_username():
            return render_template("auth.html", username=None)
    # authorization
    if validator := BEFORE_REQUEST_VALIDATORS.get((request.path, request.method)):
        if not validator():
            return make_forbidden_response()


def make_forbidden_response() -> Response:
    res = make_response("Permission denied")
    res.status_code = 403
    return res


def make_basic_auth_response() -> Response:
    res = make_response(
        "You are not authenticated. Please see "
        "https://www.mlflow.org/docs/latest/auth/index.html#authenticating-to-mlflow "
        "on how to authenticate."
    )
    res.status_code = 401
    res.headers["WWW-Authenticate"] = 'Basic realm="mlflow"'
    return res


# Experiment views
@catch_mlflow_exception
def get_experiment_permission():
    experiment_id = _get_request_param("experiment_id")
    username = _get_username()
    ep = store.get_experiment_permission(experiment_id, username)
    return make_response({"experiment_permission": ep.to_json()})


# TODO
@catch_mlflow_exception
def search_experiment():
    return render_template("home.html", username=_get_username())


def index():
    admin_allowed = False
    return render_template(
        "login.html",
        username=_get_username(),
        admin_allowed=admin_allowed,
    )


def login():
    state = secrets.token_urlsafe(16)
    session["oauth_state"] = state
    # Generate the authorization request URL with the state parameter
    authorization_url = auth_client.prepare_request_uri(
        AppConfig.get_property("OIDC_AUTHORIZATION_URL"),
        redirect_uri=AppConfig.get_property("OIDC_REDIRECT_URI"),
        scope=["openid", "profile", "email"],
        state=state,
    )
    return redirect(authorization_url)


def logout():
    session.clear()
    return redirect("/")


def callback():
    """Validate the state to protect against CSRF"""

    if (
        "oauth_state" not in session
        or _get_request_param("state") != session["oauth_state"]
    ):
        return "Invalid state parameter", 401

    # Get the access token from the authorization code
    token_url, headers, body = auth_client.prepare_token_request(
        AppConfig.get_property("OIDC_TOKEN_URL"),
        authorization_response=request.url,
        redirect_url=AppConfig.get_property("OIDC_REDIRECT_URI"),
        code=_get_request_param("code"),
        client_secret=AppConfig.get_property("OIDC_CLIENT_SECRET"),
    )
    token_response = requests.post(token_url, headers=headers, data=body)
    # Parse the access token response
    auth_client.parse_request_body_response(token_response.text)
    access_token = auth_client.token["access_token"]
    user_response = requests.get(
        AppConfig.get_property("OIDC_USER_URL"),
        headers={"Authorization": f"Bearer {access_token}"},
    )

    # Process the user data
    user_data = user_response.json()
    email = user_data.get("email", "Unknown")

    # Store the user data in the session.
    _set_username(email)
    # Create user due to auth
    create_user()
    return redirect(url_for("oidc_home"))


def oidc_static(filename):
    # Specify the directory where your static files are located
    static_directory = os.path.join(os.path.dirname(__file__), "static")
    # Return the file from the specified directory
    return send_from_directory(static_directory, filename)


# TODO
def search_model():
    return render_template("home.html", username=_get_username())


def create_user():
    try:
        user = store.get_user(_get_username())
        return (
            jsonify(
                {"message": f"User {user.username} (ID: {user.id}) already exists"}
            ),
            200,
        )
    except MlflowException:
        password = _password_generation()
        user = store.create_user(_get_username(), password)
        return (
            jsonify(
                {
                    "message": f"User {user.username} (ID: {user.id}) successfully created"
                }
            ),
            201,
        )


def update_username_password():
    new_password = _password_generation()
    store.update_user(_get_username(), new_password)
    return jsonify({"token": new_password})


@catch_mlflow_exception
def get_user():
    username = _get_request_param("username")
    user = store.get_user(username)
    return jsonify({"user": user.to_json()})


def oidc_home():
    return render_template("home.html", username=_get_username())


def permissions():
    return redirect(url_for("permissions_users"))


def permissions_users():
    users = store.list_users()
    usernames = [user.username for user in users]
    return render_template(
        "permissions.html",
        username=_get_username(),
        active_tab="users",
        items=usernames,
    )


def permissions_experiments():
    # all experiments
    list_experiments = mlflow_client.search_experiments()
    experiment_names = [experiment.name for experiment in list_experiments]

    return render_template(
        "permissions.html",
        username=_get_username(),
        active_tab="experiments",
        items=experiment_names,
    )


def permissions_models():
    # all models
    registered_models = mlflow_client.search_registered_models()
    model_names = [model.name for model in registered_models]

    return render_template(
        "permissions.html",
        username=_get_username(),
        active_tab="models",
        items=model_names,
    )


def permissions_user_details(current_username):
    # get list of experiments for current user
    list_experiments = store.list_experiment_permissions(current_username)
    experiments_list = []
    for experiments in list_experiments:
        experiment = mlflow_client.get_experiment(experiments.experiment_id)
        experiments_list.append(
            {"name": experiment.name, "permission": experiments.permission}
        )

    # get list of models for current user
    registered_models = store.list_registered_model_permissions(current_username)
    models = []
    for model in registered_models:
        models.append({"name": model.name, "permission": model.permission})

    return render_template(
        "permissions_user_details.html",
        username=session.get("username"),
        current_username=current_username,
        experiments=experiments_list,
        models=models,
    )


def permissions_experiment_details(experiment_id):
    return render_template(
        "permissions_details.html",
        username=_get_username(),
        experiment_id=experiment_id,
    )


def permissions_model_details(model_name):
    return render_template(
        "permissions_details.html", username=_get_username(), model_name=model_name
    )


def _password_generation():
    alphabet = string.ascii_letters + string.digits
    new_password = "".join(secrets.choice(alphabet) for _ in range(24))
    return new_password


def update_experiment_permission():
    request_data = request.get_json()
    # Get the experiment
    experiment = mlflow_client.get_experiment_by_name(
        request_data.get("experiment_name")
    )

    # # Update the experiment
    store.update_experiment_permission(
        experiment.experiment_id,
        request_data.get("user_name"),
        request_data.get("new_permission"),
    )
    return render_template("permissions_details.html", username=_get_username())


def update_model_permission():
    request_data = request.get_json()

    store.update_registered_model_permission(
        request_data.get("model_name"),
        request_data.get("user_name"),
        request_data.get("new_permission"),
    )
    return render_template("permissions_details.html", username=_get_username())
