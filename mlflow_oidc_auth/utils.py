from flask import request, session
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import BAD_REQUEST, INVALID_PARAMETER_VALUE
from mlflow.server import app

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
            return request.authorization.email
    return None
