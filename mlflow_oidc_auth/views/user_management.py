import secrets
import string

from flask import jsonify
from mlflow.exceptions import MlflowException
from mlflow.server.handlers import catch_mlflow_exception

from mlflow_oidc_auth.store import store
from mlflow_oidc_auth.utils import get_username


def _password_generation():
    alphabet = string.ascii_letters + string.digits
    new_password = "".join(secrets.choice(alphabet) for _ in range(24))
    return new_password


def create_user(username: str, display_name: str, is_admin: bool = False):
    try:
        user = store.get_user(username)
        store.update_user(username, is_admin=is_admin)
        return (
            jsonify({"message": f"User {user.username} (ID: {user.id}) already exists"}),
            200,
        )
    except MlflowException:
        password = _password_generation()
        user = store.create_user(username=username, password=password, display_name=display_name, is_admin=is_admin)
        return (
            jsonify({"message": f"User {user.username} (ID: {user.id}) successfully created"}),
            201,
        )


def populate_groups(group_names: list) -> None:
    store.populate_groups(group_names=group_names)


def set_user_groups(username: str, group_names: list) -> None:
    store.set_user_groups(username, group_names)


@catch_mlflow_exception
def create_access_token():
    new_token = _password_generation()
    store.update_user(get_username(), new_token)
    return jsonify({"token": new_token})


@catch_mlflow_exception
def update_username_password():
    new_password = _password_generation()
    store.update_user(get_username(), new_password)
    return jsonify({"token": new_password})
