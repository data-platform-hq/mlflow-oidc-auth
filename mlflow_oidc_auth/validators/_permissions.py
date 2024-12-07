from typing import Callable
from mlflow_oidc_auth.permissions import Permission, get_permission
from mlflow_oidc_auth.app import app
from mlflow.exceptions import MlflowException, ErrorCode
from mlflow_oidc_auth.config import config
from mlflow.protos.databricks_pb2 import RESOURCE_DOES_NOT_EXIST


def get_permission_from_store_or_default(
    store_permission_user_func: Callable[[], str], store_permission_group_func: Callable[[], str]
) -> Permission:
    """
    Attempts to get permission from store,
    and returns default permission if no record is found.
    user permission takes precedence over group permission
    """
    try:
        perm = store_permission_user_func()
        app.logger.debug("User permission found")
    except MlflowException as e:
        if e.error_code == ErrorCode.Name(RESOURCE_DOES_NOT_EXIST):
            try:
                perm = store_permission_group_func()
                app.logger.debug("Group permission found")
            except MlflowException as e:
                if e.error_code == ErrorCode.Name(RESOURCE_DOES_NOT_EXIST):
                    perm = config.DEFAULT_MLFLOW_PERMISSION
                    app.logger.debug("Default permission used")
                else:
                    raise
        else:
            raise
    return get_permission(perm)
