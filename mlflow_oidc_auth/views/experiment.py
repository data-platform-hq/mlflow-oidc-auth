from flask import jsonify, make_response
from mlflow.server.handlers import _get_tracking_store, catch_mlflow_exception

from mlflow_oidc_auth.responses.client_error import make_forbidden_response
from mlflow_oidc_auth.store import store
from mlflow_oidc_auth.utils import (
    get_experiment_id,
    get_is_admin,
    get_permission_from_store_or_default,
    get_request_param,
    get_username,
)


@catch_mlflow_exception
def create_experiment_permission():
    store.create_experiment_permission(
        get_experiment_id(),
        get_request_param("user_name"),
        get_request_param("permission"),
    )
    return jsonify({"message": "Experiment permission has been created."})


@catch_mlflow_exception
def get_experiment_permission():
    experiment_id = get_request_param("experiment_id")
    username = get_request_param("user_name")
    ep = store.get_experiment_permission(experiment_id, username)
    return make_response({"experiment_permission": ep.to_json()})


@catch_mlflow_exception
def update_experiment_permission():
    store.update_experiment_permission(
        get_experiment_id(),
        get_request_param("user_name"),
        get_request_param("permission"),
    )
    return jsonify({"message": "Experiment permission has been changed."})


@catch_mlflow_exception
def delete_experiment_permission():
    store.delete_experiment_permission(
        get_experiment_id(),
        get_request_param("user_name"),
    )
    return jsonify({"message": "Experiment permission has been deleted."})


@catch_mlflow_exception
def get_experiments():
    current_user = store.get_user(get_username())
    is_admin = get_is_admin()
    if is_admin:
        list_experiments = _get_tracking_store().search_experiments()
    else:
        list_experiments = []
        for experiment in _get_tracking_store().search_experiments():
            permission = get_permission_from_store_or_default(
                lambda: store.get_experiment_permission(experiment.experiment_id, current_user.username).permission,
                lambda: store.get_user_groups_experiment_permission(experiment.experiment_id, current_user.username).permission,
            ).permission
            if permission.can_manage:
                list_experiments.append(experiment)
    experiments = [
        {
            "name": experiment.name,
            "id": experiment.experiment_id,
            "tags": experiment.tags,
        }
        for experiment in list_experiments
    ]
    return jsonify(experiments)


@catch_mlflow_exception
def get_experiment_users(experiment_id: str):
    experiment_id = str(experiment_id)
    current_user = store.get_user(get_username())
    is_admin = get_is_admin()
    if not is_admin:
        permission = get_permission_from_store_or_default(
            lambda: store.get_experiment_permission(experiment_id, current_user.username).permission,
            lambda: store.get_user_groups_experiment_permission(experiment_id, current_user.username).permission,
        ).permission
        if not permission.can_manage:
            return make_forbidden_response()
    list_users = store.list_users()
    # Filter users who are associated with the given experiment
    users = []
    for user in list_users:
        # Check if the user is associated with the experiment
        user_experiments_details = {str(exp.experiment_id): exp.permission for exp in user.experiment_permissions}
        if experiment_id in user_experiments_details:
            users.append({"username": user.username, "permission": user_experiments_details[experiment_id]})
    return jsonify(users)
