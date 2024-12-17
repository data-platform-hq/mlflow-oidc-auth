from mlflow_oidc_auth.permissions import Permission
from mlflow_oidc_auth.store import store
from mlflow_oidc_auth.utils import get_permission_from_store_or_default, get_request_param, get_username


def _get_permission_from_registered_model_name() -> Permission:
    model_name = get_request_param("name")
    username = get_username()
    return get_permission_from_store_or_default(
        lambda: store.get_registered_model_permission(model_name, username).permission,
        lambda: store.get_user_groups_registered_model_permission(model_name, username).permission,
    ).permission


def validate_can_read_registered_model():
    return _get_permission_from_registered_model_name().can_read


def validate_can_update_registered_model():
    return _get_permission_from_registered_model_name().can_update


def validate_can_delete_registered_model():
    return _get_permission_from_registered_model_name().can_delete


def validate_can_manage_registered_model():
    return _get_permission_from_registered_model_name().can_manage
