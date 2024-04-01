import logging
import os
import secrets
import requests

from dotenv import load_dotenv
from mlflow_oidc_auth.app import app

load_dotenv()  # take environment variables from .env.


class AppConfig:
    SECRET_KEY = os.environ.get("SECRET_KEY", secrets.token_hex(16))
    SESSION_TYPE = "cachelib"

    LEVEL = logging.DEBUG if os.environ.get("DEBUG") else logging.INFO
    LOG_LEVEL = os.environ.get("LOG_LEVEL", LEVEL)

    DATABASE = "sqlite"
    DATABASE_URI = "sqlite:///" + os.path.join(app.root_path, "basic_auth.db")
    OIDC_DISCOVERY_URL = os.environ.get("OIDC_DISCOVERY_URL", None)
    if OIDC_DISCOVERY_URL:
        response = requests.get(OIDC_DISCOVERY_URL)
        config = response.json()
        OIDC_AUTHORIZATION_URL = config.get("authorization_endpoint")
        OIDC_TOKEN_URL = config.get("token_endpoint")
        OIDC_USER_URL = config.get("userinfo_endpoint")
    else:
        OIDC_AUTHORIZATION_URL = os.environ.get("OIDC_AUTHORIZATION_URL", None)
        OIDC_REDIRECT_URI = os.environ.get("OIDC_REDIRECT_URI", None)
        OIDC_USER_URL = os.environ.get("OIDC_USER_URL", None)

    OIDC_CLIENT_ID = os.environ.get("OIDC_CLIENT_ID", None)
    OIDC_CLIENT_SECRET = os.environ.get("OIDC_CLIENT_SECRET", None)
    GROUP_NAME = os.environ.get("GROUP_NAME", "mlflow")
    ADMIN_GROUP_NAME = os.environ.get("ADMIN_GROUP_NAME", "mlflow-admin")

    @staticmethod
    def get_property(property_name):
        return getattr(AppConfig, property_name, None)
