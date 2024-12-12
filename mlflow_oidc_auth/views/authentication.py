import secrets

from flask import redirect, session, url_for

import mlflow_oidc_auth.utils as utils
from mlflow_oidc_auth.auth import oauth
from mlflow_oidc_auth.app import app
from mlflow_oidc_auth.config import config
from mlflow_oidc_auth.user import create_user, populate_groups, update_user


def login():
    state = secrets.token_urlsafe(16)
    session["oauth_state"] = state
    return oauth.oidc.authorize_redirect(config.OIDC_REDIRECT_URI, state=state)


def logout():
    session.clear()
    return redirect("/")


def callback():
    """Validate the state to protect against CSRF"""

    if "oauth_state" not in session or utils.get_request_param("state") != session["oauth_state"]:
        return "Invalid state parameter", 401

    token = oauth.oidc.authorize_access_token()
    app.logger.debug(f"Token: {token}")
    session["user"] = token["userinfo"]

    email = token["userinfo"]["email"]
    if email is None:
        return "No email provided", 401
    display_name = token["userinfo"]["name"]
    is_admin = False
    user_groups = []

    if config.OIDC_GROUP_DETECTION_PLUGIN:
        import importlib

        user_groups = importlib.import_module(config.OIDC_GROUP_DETECTION_PLUGIN).get_user_groups(
            token["access_token"]
        )
    else:
        try:
            user_groups = token["userinfo"][config.OIDC_GROUPS_ATTRIBUTE]
        except KeyError:
            user_groups = []

    app.logger.debug(f"User groups: {user_groups}")
    app.logger.debug(f"OIDC_ALLOW_ALL_USERS:{config.OIDC_ALLOW_ALL_USERS}")

    if config.OIDC_ADMIN_GROUP_NAME in user_groups:
        is_admin = True
    elif not config.OIDC_ALLOW_ALL_USERS:
        if not any(group in user_groups for group in config.OIDC_GROUP_NAME):
            return "The user is not in any group that is allowed to access, so login is not allowed.", 401

    create_user(username=email.lower(), display_name=display_name, is_admin=is_admin)
    populate_groups(group_names=user_groups)
    update_user(email.lower(), user_groups)
    session["username"] = email.lower()

    return redirect(url_for("oidc_ui"))
