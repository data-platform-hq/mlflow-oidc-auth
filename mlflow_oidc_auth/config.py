import logging
import os
import secrets
import requests
import secrets

from dotenv import load_dotenv
from mlflow_oidc_auth.app import app

load_dotenv()  # take environment variables from .env.


class AppConfig:
    DEFAULT_MLFLOW_PERMISSION = os.environ.get("DEFAULT_MLFLOW_PERMISSION", "MANAGE")
    SECRET_KEY = os.environ.get("SECRET_KEY", secrets.token_hex(16))
    SESSION_TYPE = "cachelib"
    LEVEL = logging.DEBUG if os.environ.get("DEBUG") else logging.INFO
    LOG_LEVEL = os.environ.get("LOG_LEVEL", LEVEL)
    OIDC_USERS_DB_URI = os.environ.get("OIDC_USERS_DB_URI", "sqlite:///auth.db")
    OIDC_GROUP_NAME = os.environ.get("OIDC_GROUP_NAME", "mlflow")
    OIDC_ADMIN_GROUP_NAME = os.environ.get("OIDC_ADMIN_GROUP_NAME", "mlflow-admin")
    OIDC_PROVIDER_DISPLAY_NAME = os.environ.get("OIDC_PROVIDER_DISPLAY_NAME", "Login with OIDC")
    OIDC_DISCOVERY_URL = os.environ.get("OIDC_DISCOVERY_URL", None)
    OIDC_GROUPS_ATTRIBUTE = os.environ.get("OIDC_GROUPS_ATTRIBUTE", "groups")
    OIDC_SCOPE = os.environ.get("OIDC_SCOPE", "openid,email,profile")
    OIDC_PROVIDER_TYPE = os.environ.get("OIDC_PROVIDER_TYPE", "oidc") # can be 'oidc' (with groups in user info) or 'microsoft' (with dedicated groups retrieval endpoint)
    if OIDC_DISCOVERY_URL:
        response = requests.get(OIDC_DISCOVERY_URL)
        config = response.json()
        OIDC_AUTHORIZATION_URL = config.get("authorization_endpoint")
        OIDC_TOKEN_URL = config.get("token_endpoint")
        OIDC_USER_URL = config.get("userinfo_endpoint")
    else:
        OIDC_AUTHORIZATION_URL = os.environ.get("OIDC_AUTHORIZATION_URL", None)
        OIDC_TOKEN_URL = os.environ.get("OIDC_TOKEN_URL", None)
        OIDC_USER_URL = os.environ.get("OIDC_USER_URL", None)
    OIDC_REDIRECT_URI = os.environ.get("OIDC_REDIRECT_URI", None)
    OIDC_CLIENT_ID = os.environ.get("OIDC_CLIENT_ID", None)
    OIDC_CLIENT_SECRET = os.environ.get("OIDC_CLIENT_SECRET", None)


    @staticmethod
    def get_property(property_name):
        return getattr(AppConfig, property_name, None)
