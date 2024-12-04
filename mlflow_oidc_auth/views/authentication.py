import secrets

from flask import redirect, session, url_for

import mlflow_oidc_auth.utils as utils
from mlflow_oidc_auth.auth import oauth
from mlflow_oidc_auth.app import app
from mlflow_oidc_auth.config import AppConfig
from mlflow_oidc_auth.views.user_management import create_user, populate_groups, set_user_groups


def login():
    state = secrets.token_urlsafe(16)
    session["oauth_state"] = state
    return oauth.oidc.authorize_redirect(AppConfig.get_property("OIDC_REDIRECT_URI"), state=state)


def logout():
    session.clear()
    return redirect("/")


def callback():
    """Validate the state to protect against CSRF"""

    if "oauth_state" not in session or utils.get_request_param("state") != session["oauth_state"]:
        return "Invalid state parameter", 401

    token = oauth.oidc.authorize_access_token()
    session["user"] = token["userinfo"]

    email = token["userinfo"]["email"]
    if email is None:
        return "No email provided", 401
    display_name = token["userinfo"]["name"]
    is_admin = False
    user_groups = []

    if AppConfig.get_property("OIDC_GROUP_DETECTION_PLUGIN"):
        import importlib

        user_groups = importlib.import_module(AppConfig.get_property("OIDC_GROUP_DETECTION_PLUGIN")).get_user_groups(
            token["access_token"]
        )
    else:
        user_groups = token["userinfo"][AppConfig.get_property("OIDC_GROUPS_ATTRIBUTE")]

    app.logger.debug(f"User groups: {user_groups}")

    if AppConfig.get_property("OIDC_ADMIN_GROUP_NAME") in user_groups:
        is_admin = True
    elif AppConfig.get_property("OIDC_GROUP_NAME") not in user_groups:
        return "User is not allowed to login", 401

    # Create user due to auth
    create_user(username=email.lower(), display_name=display_name, is_admin=is_admin)
    populate_groups(group_names=user_groups)
    # set user groups
    set_user_groups(email.lower(), user_groups)
    # _set_username(email.lower())
    session["username"] = email.lower()

    return redirect(url_for("oidc_ui"))
