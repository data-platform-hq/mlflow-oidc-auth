from typing import Union

import requests
from authlib.integrations.flask_client import OAuth
from authlib.jose import jwt
from flask import Response, request
from werkzeug.datastructures import Authorization

from mlflow_oidc_auth.app import app
from mlflow_oidc_auth.config import config
from mlflow_oidc_auth.store import store
oauth = OAuth(app)

oauth.register(
    name="oidc",
    client_id=config.OIDC_CLIENT_ID,
    client_secret=config.OIDC_CLIENT_SECRET,
    server_metadata_url=config.OIDC_DISCOVERY_URL,
    client_kwargs={"scope": config.OIDC_SCOPE},
)

def _get_oidc_jwks():
    from mlflow_oidc_auth.app import cache
    jwks = cache.get("jwks")
    if jwks:
        app.logger.debug("JWKS cache hit")
        return jwks
    app.logger.debug("JWKS cache miss")
    metadata = requests.get(config.OIDC_DISCOVERY_URL).json()
    jwks_uri = metadata.get("jwks_uri")
    jwks = requests.get(jwks_uri).json()
    cache.set("jwks", jwks, timeout=3600)
    return jwks


def validate_token(token):
    jwks = _get_oidc_jwks()
    payload = jwt.decode(token, jwks)
    payload.validate()
    return payload


def authenticate_request_basic_auth() -> Union[Authorization, Response]:
    username = request.authorization.username
    password = request.authorization.password
    app.logger.debug("Authenticating user %s", username)
    if store.authenticate_user(username.lower(), password):
        app.logger.debug("User %s authenticated", username)
        return True
    else:
        app.logger.debug("User %s not authenticated", username)
        return False


def authenticate_request_bearer_token() -> Union[Authorization, Response]:
    token = request.authorization.token
    try:
        user = validate_token(token)
        app.logger.debug("User %s authenticated", user.get("email"))
        return True
    except Exception as e:
        app.logger.debug("JWT auth failed")
        return False