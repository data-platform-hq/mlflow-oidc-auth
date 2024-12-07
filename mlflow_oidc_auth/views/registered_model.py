from flask import jsonify, make_response
from mlflow.server.handlers import _get_model_registry_store, catch_mlflow_exception

from mlflow_oidc_auth.store import store
from mlflow_oidc_auth.utils import get_request_param


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
    # TODO: Implement pagination
    registered_models = _get_model_registry_store().search_registered_models(max_results=1000)
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
    # Get the list of all users
    list_users = store.list_users()
    # Filter users who are associated with the given model
    users = []
    for user in list_users:
        # Check if the user is associated with the model
        user_models = {model.name: model.permission for model in user.registered_model_permissions}
        if model_name in user_models:
            users.append({"username": user.username, "permission": user_models[model_name]})
    return jsonify(users)
