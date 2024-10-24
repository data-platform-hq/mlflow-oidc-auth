import os
import secrets
import requests
import secrets

from dotenv import load_dotenv
from mlflow.server import app

load_dotenv()  # take environment variables from .env.
app.logger.setLevel(os.environ.get("LOG_LEVEL", "INFO"))


class AppConfig:
    DEFAULT_MLFLOW_PERMISSION = os.environ.get("DEFAULT_MLFLOW_PERMISSION", "MANAGE")
    SECRET_KEY = os.environ.get("SECRET_KEY", secrets.token_hex(16))
    OIDC_USERS_DB_URI = os.environ.get("OIDC_USERS_DB_URI", "sqlite:///auth.db")
    OIDC_GROUP_NAME = os.environ.get("OIDC_GROUP_NAME", "mlflow")
    OIDC_ADMIN_GROUP_NAME = os.environ.get("OIDC_ADMIN_GROUP_NAME", "mlflow-admin")
    OIDC_PROVIDER_DISPLAY_NAME = os.environ.get("OIDC_PROVIDER_DISPLAY_NAME", "Login with OIDC")
    OIDC_DISCOVERY_URL = os.environ.get("OIDC_DISCOVERY_URL", None)
    OIDC_GROUPS_ATTRIBUTE = os.environ.get("OIDC_GROUPS_ATTRIBUTE", "groups")
    OIDC_SCOPE = os.environ.get("OIDC_SCOPE", "openid,email,profile")
    OIDC_GROUP_DETECTION_PLUGIN = os.environ.get("OIDC_GROUP_DETECTION_PLUGIN", None)
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
    OIDC_AUDIENCE = os.environ.get("OIDC_AUDIENCE", None)

    # https://flask-session.readthedocs.io/en/latest/config.html
    SESSION_TYPE = os.environ.get("SESSION_TYPE", "filesystem")
    SESSION_PERMANENT = os.environ.get("SESSION_PERMANENT", str(False)).lower() in ("true", "1", "t")
    SESSION_KEY_PREFIX = os.environ.get("SESSION_KEY_PREFIX", "mlflow_oidc:")
    PERMANENT_SESSION_LIFETIME = os.environ.get("PERMANENT_SESSION_LIFETIME", 86400)
    if SESSION_TYPE == "filesystem":
        SESSION_FILE_DIR = os.environ.get("SESSION_FILE_DIR", "./flask_session/")
    elif SESSION_TYPE == "redis":
        import redis
        SESSION_REDIS = redis.Redis(
            host=os.environ.get("REDIS_HOST", "localhost"),
            port=os.environ.get("REDIS_PORT", 6379),
            db=os.environ.get("REDIS_DB", 0),
            password=os.environ.get("REDIS_PASSWORD", None),
            ssl=os.environ.get("REDIS_SSL", str(False)).lower() in ("true", "1", "t"),
            username=os.environ.get("REDIS_USERNAME", None),
        )
    else:
        raise ValueError(f"Invalid session type: {SESSION_TYPE}")

    @staticmethod
    def get_property(property_name):
        app.logger.debug(f"Getting property {property_name}")
        return getattr(AppConfig, property_name, None)
