from flask import jsonify
from mlflow.server.handlers import _get_tracking_store, catch_mlflow_exception

from mlflow_oidc_auth.store import store
from mlflow_oidc_auth.utils import get_request_param


@catch_mlflow_exception
def create_group_experiment_permission(group_name):
    experiment_id = get_request_param("experiment_id")
    permission = get_request_param("permission")
    store.create_group_experiment_permission(group_name, experiment_id, permission)
    return jsonify({"message": "Group experiment permission has been created."})


@catch_mlflow_exception
def update_group_experiment_permission(group_name):
    experiment_id = get_request_param("experiment_id")
    permission = get_request_param("permission")
    store.update_group_experiment_permission(group_name, experiment_id, permission)
    return jsonify({"message": "Group experiment permission has been updated."})


@catch_mlflow_exception
def delete_group_experiment_permission(group_name):
    experiment_id = get_request_param("experiment_id")
    store.delete_group_experiment_permission(group_name, experiment_id)
    return jsonify({"message": "Group experiment permission has been deleted."})


@catch_mlflow_exception
def create_group_model_permission(group_name):
    model_name = get_request_param("model_name")
    permission = get_request_param("permission")
    store.create_group_model_permission(group_name, model_name, permission)
    return jsonify({"message": "Group model permission has been created."})


@catch_mlflow_exception
def delete_group_model_permission(group_name):
    model_name = get_request_param("model_name")
    store.delete_group_model_permission(group_name, model_name)
    return jsonify({"message": "Group model permission has been deleted."})


@catch_mlflow_exception
def update_group_model_permission(group_name):
    model_name = get_request_param("model_name")
    permission = get_request_param("permission")
    store.update_group_model_permission(group_name, model_name, permission)
    return jsonify({"message": "Group model permission has been updated."})


@catch_mlflow_exception
def get_groups():
    groups = store.get_groups()
    return jsonify({"groups": groups})


@catch_mlflow_exception
def get_group_users(group_name):
    users = store.get_group_users(group_name)
    return jsonify({"users": users})


@catch_mlflow_exception
def get_group_experiments(group_name):
    experiments = store.get_group_experiments(group_name)
    return jsonify(
        [
            {
                "id": experiment.experiment_id,
                "name": _get_tracking_store().get_experiment(experiment.experiment_id).name,
                "permission": experiment.permission,
            }
            for experiment in experiments
        ]
    )


@catch_mlflow_exception
def get_group_models(group_name):
    models = store.get_group_models(group_name)
    return jsonify([{"name": model.name, "permission": model.permission} for model in models])
