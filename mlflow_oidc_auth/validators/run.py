from mlflow_oidc_auth.store import store
from mlflow_oidc_auth.utils import get_request_param, get_username
from mlflow_oidc_auth.permissions import Permission
from mlflow.server.handlers import (
    _get_tracking_store,
)
from ._permissions import get_permission_from_store_or_default


def _get_permission_from_run_id() -> Permission:
    # run permissions inherit from parent resource (experiment)
    # so we just get the experiment permission
    run_id = get_request_param("run_id")
    run = _get_tracking_store().get_run(run_id)
    experiment_id = run.info.experiment_id
    username = get_username()
    return get_permission_from_store_or_default(
        lambda: store.get_experiment_permission(experiment_id, username).permission,
        lambda: store.get_user_groups_experiment_permission(experiment_id, username).permission,
    )


def validate_can_read_run():
    return _get_permission_from_run_id().can_read


def validate_can_update_run():
    return _get_permission_from_run_id().can_update


def validate_can_delete_run():
    return _get_permission_from_run_id().can_delete


def validate_can_manage_run():
    return _get_permission_from_run_id().can_manage
