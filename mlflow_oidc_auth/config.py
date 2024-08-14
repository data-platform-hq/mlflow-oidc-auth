import os
import secrets
import requests
import secrets

from dotenv import load_dotenv
from mlflow.server import app

load_dotenv()  # take environment variables from .env.
app.logger.setLevel(os.environ.get("LOG_LEVEL", "INFO"))


class MetaAppConfig(type):
    """MetaAppConfig class

    Used as a metaclass for AppConfig class to provide dynamic properties for static class.
    That's required to have a better code coverage while still allowing to pass the class as config to Flask app.
    """

    _DEFAULT_DISCOVERED_URLS = {}

    def _initialize_urls(cls):
        if len(cls._DEFAULT_DISCOVERED_URLS) == 3:
            return
        if os.environ.get("OIDC_DISCOVERY_URL", None) is None:
            return

        response = requests.get(cls.OIDC_DISCOVERY_URL)
        config = response.json()
        cls._DEFAULT_DISCOVERED_URLS["authorization_endpoint"] = config.get("authorization_endpoint")
        cls._DEFAULT_DISCOVERED_URLS["token_endpoint"] = config.get("token_endpoint")
        cls._DEFAULT_DISCOVERED_URLS["userinfo_endpoint"] = config.get("userinfo_endpoint")

    @property
    def OIDC_DISCOVERY_URL(cls):
        return os.environ.get("OIDC_DISCOVERY_URL", None)

    @property
    def OIDC_AUTHORIZATION_URL(cls):
        cls._initialize_urls()
        return cls._DEFAULT_DISCOVERED_URLS.get("authorization_endpoint", None)

    @property
    def OIDC_TOKEN_URL(cls):
        cls._initialize_urls()
        return cls._DEFAULT_DISCOVERED_URLS.get("token_endpoint", None)

    @property
    def OIDC_USER_URL(cls):
        cls._initialize_urls()
        return cls._DEFAULT_DISCOVERED_URLS.get("userinfo_endpoint", None)


class AppConfig(metaclass=MetaAppConfig):
    DEFAULT_MLFLOW_PERMISSION = os.environ.get("DEFAULT_MLFLOW_PERMISSION", "MANAGE")
    SECRET_KEY = os.environ.get("SECRET_KEY", secrets.token_hex(16))
    SESSION_TYPE = "cachelib"
    OIDC_USERS_DB_URI = os.environ.get("OIDC_USERS_DB_URI", "sqlite:///auth.db")
    OIDC_GROUP_NAME = os.environ.get("OIDC_GROUP_NAME", "mlflow")
    OIDC_ADMIN_GROUP_NAME = os.environ.get("OIDC_ADMIN_GROUP_NAME", "mlflow-admin")
    OIDC_PROVIDER_DISPLAY_NAME = os.environ.get("OIDC_PROVIDER_DISPLAY_NAME", "Login with OIDC")
    OIDC_GROUPS_ATTRIBUTE = os.environ.get("OIDC_GROUPS_ATTRIBUTE", "groups")
    OIDC_SCOPE = os.environ.get("OIDC_SCOPE", "openid,email,profile")
    OIDC_GROUP_DETECTION_PLUGIN = os.environ.get("OIDC_GROUP_DETECTION_PLUGIN", None)
    OIDC_REDIRECT_URI = os.environ.get("OIDC_REDIRECT_URI", None)
    OIDC_CLIENT_ID = os.environ.get("OIDC_CLIENT_ID", None)
    OIDC_CLIENT_SECRET = os.environ.get("OIDC_CLIENT_SECRET", None)

    @staticmethod
    def get_property(property_name):
        app.logger.debug(f"Getting property {property_name}")
        return getattr(AppConfig, property_name, None)
