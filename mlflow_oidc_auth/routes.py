from mlflow.server.handlers import _get_rest_path

HOME = "/"
LOGIN = "/login"
LOGOUT = "/logout"
CALLBACK = "/callback"

STATIC = "/oidc/static/<path:filename>"
PERMISSIONS = "/oidc/permissions"
PERMISSIONS_USERS = "/oidc/permissions/users"
PERMISSIONS_EXPERIMENTS = "/oidc/permissions/experiments"
PERMISSIONS_MODELS = "/oidc/permissions/models"
PERMISSIONS_OIDC_GROUP = "/oidc/permissions/oidc-group"
PERMISSIONS_USER_DETAILS = "/oidc/permissions/users/<string:current_username>"
PERMISSIONS_EXPERIMENT_DETAILS = "/oidc/permissions/experiments/<int:experiment_id>"
PERMISSIONS_MODEL_DETAILS = "/oidc/permissions/models/<string:model_name>"
PERMISSIONS_OIDC_GROUP_DETAILS = "/oidc/permissions/oidc-group/<string:group_name>"
OIDC_HOME = "/oidc"

SEARCH_MODEL = _get_rest_path("/mlflow/search_model")
SEARCH_EXPERIMENT = _get_rest_path("/mlflow/search_experiment")
LOGIN_MLFLOW = _get_rest_path("/login_mlflow")
CREATE_USER = _get_rest_path("/mlflow/users/create")
GET_USER = _get_rest_path("/mlflow/users/get")
UPDATE_USER_PASSWORD = _get_rest_path("/mlflow/users/update-password")
UPDATE_USER_ADMIN = _get_rest_path("/mlflow/users/update-admin")
DELETE_USER = _get_rest_path("/mlflow/users/delete")
CREATE_EXPERIMENTS = _get_rest_path("mlflow/experiments/create")
CREATE_EXPERIMENT_PERMISSION = _get_rest_path("/mlflow/experiments/permissions/create")
GET_EXPERIMENT_PERMISSION = _get_rest_path("/mlflow/experiments/permissions/get")
UPDATE_EXPERIMENT_PERMISSION = _get_rest_path("/mlflow/experiments/permissions/update")
DELETE_EXPERIMENT_PERMISSION = _get_rest_path("/mlflow/experiments/permissions/delete")
CREATE_REGISTERED_MODEL_PERMISSION = _get_rest_path(
    "/mlflow/registered-models/permissions/create"
)
GET_REGISTERED_MODEL_PERMISSION = _get_rest_path(
    "/mlflow/registered-models/permissions/get"
)
UPDATE_REGISTERED_MODEL_PERMISSION = _get_rest_path(
    "/mlflow/registered-models/permissions/update"
)
DELETE_REGISTERED_MODEL_PERMISSION = _get_rest_path(
    "/mlflow/registered-models/permissions/delete"
)
