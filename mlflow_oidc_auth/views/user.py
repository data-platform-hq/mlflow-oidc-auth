from flask import jsonify
from mlflow.server.handlers import _get_tracking_store, catch_mlflow_exception

from mlflow_oidc_auth.permissions import NO_PERMISSIONS, get_permission
from mlflow_oidc_auth.store import store
from mlflow_oidc_auth.user import create_user, generate_token
from mlflow_oidc_auth.utils import get_is_admin, get_request_param, get_username


def create_user(username: str, display_name: str, is_admin: bool = False):
    status, message = create_user(username, display_name, is_admin)
    if status:
        return (jsonify({"message": message}), 201)
    else:
        return (jsonify({"message": message}), 200)


@catch_mlflow_exception
def get_user():
    username = get_request_param("user_name")
    user = store.get_user(username)
    return jsonify({"user": user.to_json()})


@catch_mlflow_exception
def delete_user():
    store.delete_user(get_request_param("user_name"))
    return jsonify({"message": f"User {get_username()} has been deleted"})


@catch_mlflow_exception
def create_access_token():
    new_token = generate_token()
    store.update_user(get_username(), new_token)
    return jsonify({"token": new_token})


@catch_mlflow_exception
def update_username_password():
    new_password = generate_token()
    store.update_user(get_username(), new_password)
    return jsonify({"token": new_password})


@catch_mlflow_exception
def get_user_experiments(username):
    # get list of experiments for the user
    list_experiments = store.list_experiment_permissions(username)
    experiments_list = []
    for experiments in list_experiments:
        experiment = _get_tracking_store().get_experiment(experiments.experiment_id)
        experiments_list.append(
            {
                "name": experiment.name,
                "id": experiments.experiment_id,
                "permission": experiments.permission,
            }
        )
    return jsonify({"experiments": experiments_list})


@catch_mlflow_exception
def get_user_models(username):
    # get list of models for current user
    registered_models = store.list_registered_model_permissions(username)
    models = []
    for model in registered_models:
        models.append({"name": model.name, "permission": model.permission})
    # return as json
    return jsonify({"models": models})


@catch_mlflow_exception
def get_users():
    # check is admin
    # if not get_is_admin():
    #     return make_forbidden_response()
    users = [user.username for user in store.list_users()]
    return jsonify({"users": users})


@catch_mlflow_exception
def update_user_admin():
    is_admin = get_request_param("is_admin")
    store.update_user(get_username(), is_admin)
    return jsonify({"is_admin": is_admin})


@catch_mlflow_exception
def get_current_user():
    user = store.get_user(get_username())
    user_json = user.to_json()
    user_json["experiment_permissions"] = [
        {
            "name": _get_tracking_store().get_experiment(permission.experiment_id).name,
            "id": permission.experiment_id,
            "permission": permission.permission,
        }
        for permission in user.experiment_permissions
    ]
    if not get_is_admin():
        user_json["experiment_permissions"] = [
            permission for permission in user_json["experiment_permissions"] if permission["permission"] != NO_PERMISSIONS.name
        ]
        user_json["registered_model_permissions"] = [
            registered_model_permission
            for registered_model_permission in user_json["registered_model_permissions"]
            if registered_model_permission["permission"] != get_permission(NO_PERMISSIONS.name)
        ]
    return jsonify(user_json)
