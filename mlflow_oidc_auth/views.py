import logging
import os
import requests
import secrets
import string
from typing import Callable, Union

from mlflow.utils.proto_json_utils import parse_dict
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

from mlflow.protos.model_registry_pb2 import (
    CreateModelVersion,
    CreateRegisteredModel,
    DeleteModelVersion,
    DeleteModelVersionTag,
    DeleteRegisteredModel,
    DeleteRegisteredModelAlias,
    DeleteRegisteredModelTag,
    GetLatestVersions,
    GetModelVersion,
    GetModelVersionByAlias,
    GetModelVersionDownloadUri,
    GetRegisteredModel,
    RenameRegisteredModel,
    SearchRegisteredModels,
    SetModelVersionTag,
    SetRegisteredModelAlias,
    SetRegisteredModelTag,
    TransitionModelVersionStage,
    UpdateModelVersion,
    UpdateRegisteredModel,
)

from mlflow.protos.service_pb2 import (
    CreateExperiment,
    CreateRun,
    DeleteExperiment,
    DeleteRun,
    DeleteTag,
    GetExperiment,
    GetExperimentByName,
    RestoreExperiment,
    SearchExperiments,
    SetExperimentTag,
    SetTag,
    UpdateExperiment,
    UpdateRun,
)
from mlflow_oidc_auth.permissions import Permission, get_permission, MANAGE
from mlflow.server.handlers import (
    catch_mlflow_exception,
    get_endpoints,
)

from mlflow.tracking import MlflowClient
from oauthlib.oauth2 import WebApplicationClient

from mlflow_oidc_auth import routes

# from mlflow_oidc_auth.client import AuthServiceClient
from mlflow_oidc_auth.config import AppConfig
from mlflow_oidc_auth.sqlalchemy_store import SqlAlchemyStore

# Create the OAuth2 client
auth_client = WebApplicationClient(AppConfig.get_property("OIDC_CLIENT_ID"))
mlflow_client = MlflowClient()
store = SqlAlchemyStore()
store.init_db((AppConfig.get_property("OIDC_USERS_DB_URI")))
_logger = logging.getLogger(__name__)


def _get_experiment_id(request_data: dict) -> str:
    experiment_id = request_data.get("experiment_id")
    if "experiment_id" not in request_data:
        experiment_id = mlflow_client.get_experiment_by_name(request_data.get("experiment_name")).experiment_id
    return experiment_id

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
    return path.startswith(("/static", "/favicon.ico", "/health", "/login", "/callback", "/oidc/static", "/oidc/ui"))


def _get_permission_from_store_or_default(store_permission_func: Callable[[], str]) -> Permission:
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


def _get_display_name():
    return session.get("display_name")


def _set_display_name(display_name):
    session["display_name"] = display_name
    return


def _set_is_admin(_is_admin: bool = False):
    session["is_admin"] = _is_admin
    return


def _get_is_admin():
    return session.get("is_admin")


def _get_permission_from_experiment_id() -> Permission:
    experiment_id = _get_request_param("experiment_id")
    username = _get_username()
    return _get_permission_from_store_or_default(
        lambda: store.get_experiment_permission(experiment_id, username).permission)


def _get_permission_from_experiment_name() -> Permission:
    experiment_name = _get_request_param("experiment_name")
    store_exp = mlflow_client.get_experiment_by_name(experiment_name)
    if store_exp is None:
        raise MlflowException(
            f"Could not find experiment with name {experiment_name}",
            error_code=RESOURCE_DOES_NOT_EXIST,
        )
    username = _get_username()
    return _get_permission_from_store_or_default(
        lambda: store.get_experiment_permission(store_exp.experiment_id, username).permission
    )


def _get_permission_from_registered_model_name() -> Permission:
    name = _get_request_param("name")
    username = _get_username()
    return _get_permission_from_store_or_default(
        lambda: store.get_registered_model_permission(name, username).permission
    )


def _set_can_manage_experiment_permission(resp: Response):
    response_message = CreateExperiment.Response()
    parse_dict(resp.json, response_message)
    experiment_id = response_message.experiment_id
    username = _get_username()
    store.create_experiment_permission(experiment_id, username, MANAGE.name)


def _set_can_manage_registered_model_permission(resp: Response):
    response_message = CreateRegisteredModel.Response()
    parse_dict(resp.json, response_message)
    name = response_message.registered_model.name
    username = _get_username()
    store.create_registered_model_permission(name, username, MANAGE.name)


def delete_can_manage_registered_model_permission(resp: Response):
    """
    Delete registered model permission when the model is deleted.

    We need to do this because the primary key of the registered model is the name,
    unlike the experiment where the primary key is experiment_id (UUID). Therefore,
    we have to delete the permission record when the model is deleted otherwise it
    conflicts with the new model registered with the same name.
    """
    # Get model name from request context because it's not available in the response
    name = request.get_json(force=True, silent=True)["name"]
    username = _get_username()
    store.delete_registered_model_permission(name, username)


def _validate_can_manage_experiment():
    return _get_permission_from_experiment_id().can_manage


def _validate_can_manage_registered_model():
    return _get_permission_from_registered_model_name().can_manage


def _validate_can_read_experiment():
    return _get_permission_from_experiment_id().can_read


def _validate_can_read_experiment_by_name():
    return _get_permission_from_experiment_name().can_read


def _validate_can_update_experiment():
    return _get_permission_from_experiment_id().can_update


def _validate_can_delete_experiment():
    return _get_permission_from_experiment_id().can_delete


def _validate_can_read_registered_model():
    return _get_permission_from_registered_model_name().can_read


def _validate_can_update_registered_model():
    return _get_permission_from_registered_model_name().can_update


def _validate_can_delete_registered_model():
    return _get_permission_from_registered_model_name().can_delete


def _get_before_request_handler(request_class):
    return BEFORE_REQUEST_HANDLERS.get(request_class)


BEFORE_REQUEST_HANDLERS = {
    # Routes for experiments
    CreateExperiment: _validate_can_manage_experiment,
    GetExperiment: _validate_can_read_experiment,
    GetExperimentByName: _validate_can_read_experiment_by_name,
    DeleteExperiment: _validate_can_delete_experiment,
    RestoreExperiment: _validate_can_delete_experiment,
    UpdateExperiment: _validate_can_update_experiment,
    SetExperimentTag: _validate_can_update_experiment,
    # Routes for model registry
    GetRegisteredModel: _validate_can_read_registered_model,
    DeleteRegisteredModel: _validate_can_delete_registered_model,
    UpdateRegisteredModel: _validate_can_update_registered_model,
    RenameRegisteredModel: _validate_can_update_registered_model,
    GetLatestVersions: _validate_can_read_registered_model,
    CreateModelVersion: _validate_can_update_registered_model,
    GetModelVersion: _validate_can_read_registered_model,
    DeleteModelVersion: _validate_can_delete_registered_model,
    UpdateModelVersion: _validate_can_update_registered_model,
    TransitionModelVersionStage: _validate_can_update_registered_model,
    GetModelVersionDownloadUri: _validate_can_read_registered_model,
    SetRegisteredModelTag: _validate_can_update_registered_model,
    DeleteRegisteredModelTag: _validate_can_update_registered_model,
    SetModelVersionTag: _validate_can_update_registered_model,
    DeleteModelVersionTag: _validate_can_delete_registered_model,
    SetRegisteredModelAlias: _validate_can_update_registered_model,
    DeleteRegisteredModelAlias: _validate_can_delete_registered_model,
    GetModelVersionByAlias: _validate_can_read_registered_model,
}

BEFORE_REQUEST_VALIDATORS = {
    (http_path, method): handler
    for http_path, handler, methods in get_endpoints(_get_before_request_handler)
    for method in methods
}

BEFORE_REQUEST_VALIDATORS.update(
    {
        (routes.CREATE_EXPERIMENT_PERMISSION, "GET"): _validate_can_manage_experiment,
        (routes.GET_EXPERIMENT_PERMISSION, "GET"): _validate_can_manage_experiment,
        (routes.CREATE_EXPERIMENT_PERMISSION, "POST"): _validate_can_manage_experiment,
        (routes.UPDATE_EXPERIMENT_PERMISSION, "PATCH"): _validate_can_manage_experiment,
        (routes.DELETE_EXPERIMENT_PERMISSION, "DELETE"): _validate_can_manage_experiment,
        (routes.GET_REGISTERED_MODEL_PERMISSION, "GET"): _validate_can_manage_registered_model,
        (routes.CREATE_REGISTERED_MODEL_PERMISSION, "POST"): _validate_can_manage_registered_model,
        (routes.UPDATE_REGISTERED_MODEL_PERMISSION, "PATCH"): _validate_can_manage_registered_model,
        (routes.DELETE_REGISTERED_MODEL_PERMISSION, "DELETE"): _validate_can_manage_registered_model,
    }
)

AFTER_REQUEST_PATH_HANDLERS = {
    CreateExperiment: _set_can_manage_experiment_permission,
    CreateRegisteredModel: _set_can_manage_registered_model_permission,
    DeleteRegisteredModel: delete_can_manage_registered_model_permission,
}


def get_after_request_handler(request_class):
    return AFTER_REQUEST_PATH_HANDLERS.get(request_class)


AFTER_REQUEST_HANDLERS = {
    (http_path, method): handler
    for http_path, handler, methods in get_endpoints(get_after_request_handler)
    for method in methods
}


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
            return render_template(
                "auth.html",
                username=None,
                provide_display_name=AppConfig.get_property("OIDC_PROVIDER_DISPLAY_NAME"),
            )
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
        "You are not authenticated. Please see documentation for details" "https://github.com/data-platform-hq/mlflow-oidc-auth"
    )
    res.status_code = 401
    res.headers["WWW-Authenticate"] = 'Basic realm="mlflow"'
    return res


def create_experiment_permission():
    request_data = request.get_json()
    store.create_experiment_permission(
        _get_experiment_id(request_data),
        request_data.get("user_name"),
        request_data.get("new_permission"),
    )
    return jsonify({"message": "Experiment permission has been created."})


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


def login():
    state = secrets.token_urlsafe(16)
    session["oauth_state"] = state
    # Generate the authorization request URL with the state parameter
    authorization_url = auth_client.prepare_request_uri(
        AppConfig.get_property("OIDC_AUTHORIZATION_URL"),
        redirect_uri=AppConfig.get_property("OIDC_REDIRECT_URI"),
        scope=AppConfig.get_property("OIDC_SCOPE").split(","),
        state=state,
    )
    return redirect(authorization_url)


def logout():
    session.clear()
    return redirect("/")


def callback():
    """Validate the state to protect against CSRF"""

    if "oauth_state" not in session or _get_request_param("state") != session["oauth_state"]:
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
    _set_display_name(user_data.get("name", "Unknown"))

    # check if user is in the group
    if AppConfig.get_property("OIDC_PROVIDER_TYPE") == "microsoft":
        # get groups from graph api
        graph_url = "https://graph.microsoft.com/v1.0/me/memberOf"
        group_response = requests.get(
            graph_url,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            },
        )
        group_data = group_response.json()
        print(AppConfig.get_property("OIDC_GROUP_NAME"))
        if not any(group["displayName"] == AppConfig.get_property("OIDC_GROUP_NAME") for group in group_data["value"]):
            return "User not in group", 401
        # set is_admin if user is in admin group
        if any(group["displayName"] == AppConfig.get_property("OIDC_ADMIN_GROUP_NAME") for group in group_data["value"]):
            _set_is_admin(True)
        else:
            _set_is_admin(False)
    elif AppConfig.get_property("OIDC_PROVIDER_TYPE") == "oidc":
        print(user_data.get("groups", []))
        if AppConfig.get_property("OIDC_GROUP_NAME") not in user_data.get("groups", []):
            return "User not in group", 401
        # set is_admin if user is in admin group
        if AppConfig.get_property("OIDC_ADMIN_GROUP_NAME") in user_data.get("groups", []):
            _set_is_admin(True)
        else:
            _set_is_admin(False)

    # Store the user data in the session.
    _set_username(email)
    # Create user due to auth
    create_user()
    return redirect(url_for("oidc_ui"))


def oidc_static(filename):
    # Specify the directory where your static files are located
    static_directory = os.path.join(os.path.dirname(__file__), "static")
    # Return the file from the specified directory
    return send_from_directory(static_directory, filename)


def oidc_ui(filename=None):
    # Specify the directory where your static files are located
    ui_directory = os.path.join(os.path.dirname(__file__), "ui")
    print(filename)
    if not filename:
        filename = "index.html"
    elif not os.path.exists(os.path.join(ui_directory, filename)):
        filename = "index.html"
    return send_from_directory(ui_directory, filename)


# TODO
def search_model():
    return render_template("home.html", username=_get_username())


def create_user():
    try:
        user = store.get_user(_get_username())
        return (
            jsonify({"message": f"User {user.username} (ID: {user.id}) already exists"}),
            200,
        )
    except MlflowException:
        password = _password_generation()
        user = store.create_user(
            username=_get_username(), password=password, display_name=_get_display_name(), is_admin=_get_is_admin()
        )
        return (
            jsonify({"message": f"User {user.username} (ID: {user.id}) successfully created"}),
            201,
        )


def create_access_token():
    new_token = _password_generation()
    store.update_user(_get_username(), new_token)
    return jsonify({"token": new_token})


def get_current_user():
    user = store.get_user(_get_username())
    user_json = user.to_json()
    user_json["experiment_permissions"] = [
        {
            "name": mlflow_client.get_experiment(permission.experiment_id).name,
            "id": permission.experiment_id,
            "permission": permission.permission,
        }
        for permission in user.experiment_permissions
    ]
    return jsonify(user_json)


def update_username_password():
    new_password = _password_generation()
    store.update_user(_get_username(), new_password)
    return jsonify({"token": new_password})


def update_user_admin():
    is_admin = _get_request_param("is_admin")
    store.update_user(_get_username(), is_admin)
    return jsonify({"is_admin": is_admin})


def delete_user():
    store.delete_user(_get_username())
    return jsonify({"message": f"User {_get_username()} has been deleted"})


@catch_mlflow_exception
def get_user():
    username = _get_request_param("username")
    user = store.get_user(username)
    return jsonify({"user": user.to_json()})


def oidc_home():
    return render_template("home.html", username=_get_username())


def permissions():
    return redirect(url_for("list_users"))


def get_users():
    # check is admin
    # if not _get_is_admin():
    #     return make_forbidden_response()
    users = [user.username for user in store.list_users()]
    return jsonify({"users": users})


def get_experiments():
    list_experiments = mlflow_client.search_experiments()
    experiments = [
        {
            "name": experiment.name,
            "id": experiment.experiment_id,
            "tags": experiment.tags,
        }
        for experiment in list_experiments
    ]
    return jsonify(experiments)


def get_models():
    registered_models = mlflow_client.search_registered_models()
    models = [
        {
            "name": model.name,
            "tags": model.tags,
            "description": model.description,
            "latest_versions": model.latest_versions,
            "aliases": model.aliases,
        }
        for model in registered_models
    ]
    return jsonify(models)


def get_user_experiments(username):
    # get list of experiments for the user
    list_experiments = store.list_experiment_permissions(username)
    experiments_list = []
    for experiments in list_experiments:
        experiment = mlflow_client.get_experiment(experiments.experiment_id)
        experiments_list.append(
            {
                "name": experiment.name,
                "id": experiments.experiment_id,
                "permissions": experiments.permission,
            }
        )
    return jsonify({"experiments": experiments_list})


def get_user_models(username):
    # get list of models for current user
    registered_models = store.list_registered_model_permissions(username)
    models = []
    for model in registered_models:
        models.append({"name": model.name, "permissions": model.permission})
    # return as json
    return jsonify({"models": models})


def get_experiment_users(experiment_id):
    # Convert experiment_id to string for comparison
    experiment_id = str(experiment_id)

    # Get the list of all users
    list_users = store.list_users()

    # Filter users who are associated with the given experiment
    usernames = []
    for user in list_users:
        # Check if the user is associated with the experiment
        user_experiments = [str(exp.experiment_id) for exp in user.experiment_permissions]
        if experiment_id in user_experiments:
            usernames.append(user.username)

    return jsonify({"usernames": usernames})


def get_model_users(model_name):
    # Get the list of all users
    list_users = store.list_users()

    # Filter users who are associated with the given model
    usernames = []
    for user in list_users:
        # Check if the user is associated with the model
        user_models = [model.name for model in user.registered_model_permissions]
        if model_name in user_models:
            usernames.append(user.username)

    return jsonify({"usernames": usernames})


def _password_generation():
    alphabet = string.ascii_letters + string.digits
    new_password = "".join(secrets.choice(alphabet) for _ in range(24))
    return new_password


def update_experiment_permission():
    request_data = request.get_json()
    store.update_experiment_permission(
        _get_experiment_id(request_data),
        request_data.get("user_name"),
        request_data.get("new_permission"),
    )
    return jsonify({"message": "Experiment permission has been changed."})


def delete_experiment_permission():
    request_data = request.get_json()
    store.delete_experiment_permission(
        _get_experiment_id(request_data),
        request_data.get("user_name"),
    )
    return jsonify({"message": "Experiment permission has been deleted."})

@catch_mlflow_exception
def create_registered_model_permission():
    name = _get_request_param("name")
    username = _get_username()
    permission = _get_request_param("permission")
    rmp = store.create_registered_model_permission(name, username, permission)
    return make_response({"registered_model_permission": rmp.to_json()})


@catch_mlflow_exception
def get_registered_model_permission():
    name = _get_request_param("name")
    username = _get_username()
    rmp = store.get_registered_model_permission(name, username)
    return make_response({"registered_model_permission": rmp.to_json()})


@catch_mlflow_exception
def update_registered_model_permission():
    name = _get_request_param("name")
    username = _get_username()
    permission = _get_request_param("permission")
    store.update_registered_model_permission(name, username, permission)
    return make_response("Model permission has been changed")


@catch_mlflow_exception
def delete_registered_model_permission():
    name = _get_request_param("name")
    username = _get_username()
    store.delete_registered_model_permission(name, username)
    return make_response("Model permission has been deleted")


def set_can_manage_experiment_permission(resp: Response):
    response_message = CreateExperiment.Response()
    parse_dict(resp.json, response_message)
    experiment_id = response_message.experiment_id
    username = _get_username()
    store.create_experiment_permission(experiment_id, username, MANAGE.name)


def set_can_manage_registered_model_permission(resp: Response):
    response_message = CreateRegisteredModel.Response()
    parse_dict(resp.json, response_message)
    name = response_message.registered_model.name
    username = _get_username()
    store.create_registered_model_permission(name, username, MANAGE.name)
