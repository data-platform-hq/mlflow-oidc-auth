from flask import request, session
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import BAD_REQUEST, INVALID_PARAMETER_VALUE
from mlflow.server import app
from mlflow.server.handlers import _get_tracking_store

from mlflow_oidc_auth.store import store
from mlflow_oidc_auth.auth import validate_token


def get_request_param(param: str) -> str:
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
            return get_request_param("run_uuid")
        raise MlflowException(
            f"Missing value for required parameter '{param}'. "
            "See the API docs for more information about request parameters.",
            INVALID_PARAMETER_VALUE,
        )
    return args[param]


def get_username():
    username = session.get("username")
    if username:
        app.logger.debug(f"Username from session: {username}")
        return username
    elif request.authorization is not None:
        if request.authorization.type == "basic":
            app.logger.debug(f"Username from basic auth: {request.authorization.username}")
            return request.authorization.username
        if request.authorization.type == "bearer":
            username = validate_token(request.authorization.token).get("email")
            app.logger.debug(f"Username from bearer token: {username}")
            return username
    return None


def get_is_admin() -> bool:
    return bool(store.get_user(get_username()).is_admin)


def get_experiment_id() -> str:
    if request.method == "GET":
        args = request.args
    elif request.method in ("POST", "PATCH", "DELETE"):
        args = request.json
    else:
        raise MlflowException(
            f"Unsupported HTTP method '{request.method}'",
            BAD_REQUEST,
        )
    if "experiment_id" in args:
        return args["experiment_id"]
    elif "experiment_name" in args:
        return _get_tracking_store().get_experiment_by_name(args["experiment_name"]).experiment_id
    raise MlflowException(
        "Either 'experiment_id' or 'experiment_name' must be provided in the request data.",
        INVALID_PARAMETER_VALUE,
    )
