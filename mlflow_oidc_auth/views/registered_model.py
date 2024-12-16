from flask import jsonify, make_response
from mlflow.server.handlers import _get_model_registry_store, catch_mlflow_exception

from mlflow_oidc_auth.responses.client_error import make_forbidden_response
from mlflow_oidc_auth.store import store
from mlflow_oidc_auth.utils import get_is_admin, get_permission_from_store_or_default, get_request_param, get_username


@catch_mlflow_exception
def create_registered_model_permission():
    name = get_request_param("name")
    username = get_request_param("user_name")
    permission = get_request_param("permission")
    rmp = store.create_registered_model_permission(name, username, permission)
    return make_response({"registered_model_permission": rmp.to_json()})


@catch_mlflow_exception
def get_registered_model_permission():
    name = get_request_param("name")
    username = get_request_param("user_name")
    rmp = store.get_registered_model_permission(name, username)
    return make_response({"registered_model_permission": rmp.to_json()})


@catch_mlflow_exception
def update_registered_model_permission():
    name = get_request_param("name")
    username = get_request_param("user_name")
    permission = get_request_param("permission")
    store.update_registered_model_permission(name, username, permission)
    return make_response(jsonify({"message": "Model permission has been changed"}))


@catch_mlflow_exception
def delete_registered_model_permission():
    name = get_request_param("name")
    username = get_request_param("user_name")
    store.delete_registered_model_permission(name, username)
    return make_response(jsonify({"message": "Model permission has been deleted"}))


@catch_mlflow_exception
def get_registered_models():
    current_user = store.get_user(get_username())
    is_admin = get_is_admin()
    if is_admin:
        registered_models = _get_model_registry_store().search_registered_models(max_results=1000)
    else:
        registered_models = []
        for model in _get_model_registry_store().search_registered_models(max_results=1000):
            permission = get_permission_from_store_or_default(
                lambda: store.get_registered_model_permission(model.name, current_user.username).permission,
                lambda: store.get_user_groups_registered_model_permission(model.name, current_user.username).permission,
            ).permission
            if permission.can_manage:
                registered_models.append(model)
    models = [
        {
            "name": model.name,
            "tags": model.tags,
            "description": model.description,
            "aliases": model.aliases,
        }
        for model in registered_models
    ]
    return jsonify(models)


@catch_mlflow_exception
def get_registered_model_users(model_name):
    current_user = store.get_user(get_username())
    is_admin = get_is_admin()
    if not is_admin:
        permission = get_permission_from_store_or_default(
            lambda: store.get_registered_model_permission(model_name, current_user.username).permission,
            lambda: store.get_user_groups_registered_model_permission(model_name, current_user.username).permission,
        ).permission
        if not permission.can_manage:
            return make_forbidden_response()
    list_users = store.list_users()
    # Filter users who are associated with the given model
    users = []
    for user in list_users:
        # Check if the user is associated with the model
        user_models = {model.name: model.permission for model in user.registered_model_permissions}
        if model_name in user_models:
            users.append({"username": user.username, "permission": user_models[model_name]})
    return jsonify(users)
