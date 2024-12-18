from unittest.mock import patch, MagicMock
from mlflow_oidc_auth.auth import (
    get_oauth_instance,
    _get_oidc_jwks,
    validate_token,
    authenticate_request_basic_auth,
    authenticate_request_bearer_token,
)


class TestAuth:
    @patch("mlflow_oidc_auth.auth.OAuth")
    @patch("mlflow_oidc_auth.auth.config")
    def test_get_oauth_instance(self, mock_config, mock_oauth):
        mock_app = MagicMock()
        mock_oauth_instance = MagicMock()
        mock_oauth.return_value = mock_oauth_instance

        mock_config.OIDC_CLIENT_ID = "mock_client_id"
        mock_config.OIDC_CLIENT_SECRET = "mock_client_secret"
        mock_config.OIDC_DISCOVERY_URL = "mock_discovery_url"
        mock_config.OIDC_SCOPE = "mock_scope"

        result = get_oauth_instance(mock_app)

        mock_oauth.assert_called_once_with(mock_app)
        mock_oauth_instance.register.assert_called_once_with(
            name="oidc",
            client_id="mock_client_id",
            client_secret="mock_client_secret",
            server_metadata_url="mock_discovery_url",
            client_kwargs={"scope": "mock_scope"},
        )
        assert result == mock_oauth_instance

    @patch("mlflow_oidc_auth.auth._get_oidc_jwks")
    @patch("mlflow_oidc_auth.auth.jwt.decode")
    def test_validate_token(self, mock_jwt_decode, mock_get_oidc_jwks):
        mock_jwks = {"keys": "mock_keys"}
        mock_get_oidc_jwks.return_value = mock_jwks
        mock_payload = MagicMock()
        mock_jwt_decode.return_value = mock_payload

        token = "mock_token"
        result = validate_token(token)

        mock_get_oidc_jwks.assert_called_once()
        mock_jwt_decode.assert_called_once_with(token, mock_jwks)
        mock_payload.validate.assert_called_once()
        assert result == mock_payload

    @patch("mlflow_oidc_auth.auth.store")
    def test_authenticate_request_basic_auth_uses_authenticate_user(self, mock_store):
        mock_request = MagicMock()
        mock_request.authorization.username = "mock_username"
        mock_request.authorization.password = "mock_password"
        mock_store.authenticate_user.return_value = True

        with patch("mlflow_oidc_auth.auth.request", mock_request):
            # for some reason decorator doesn't mock flask
            result = authenticate_request_basic_auth()

            mock_store.authenticate_user.assert_called_once_with("mock_username", "mock_password")
            assert result == True

    @patch("mlflow_oidc_auth.auth.validate_token")
    def test_authenticate_request_bearer_token_uses_validate_token(self, mock_validate_token):
        mock_request = MagicMock()
        mock_request.authorization.token = "mock_token"
        mock_validate_token.return_value = MagicMock()
        with patch("mlflow_oidc_auth.auth.request", mock_request):
            # for some reason decorator doesn't mock flask
            result = authenticate_request_bearer_token()

            mock_validate_token.assert_called_once_with("mock_token")
            assert result == True

    @patch("mlflow_oidc_auth.auth.validate_token")
    def test_authenticate_request_bearer_token_exception_returns_false(self, mock_validate_token):
        mock_request = MagicMock()
        mock_request.authorization.token = "mock_token"
        mock_validate_token.side_effect = Exception()
        with patch("mlflow_oidc_auth.auth.request", mock_request):
            # for some reason decorator doesn't mock flask
            result = authenticate_request_bearer_token()

            mock_validate_token.assert_called_once_with("mock_token")
            assert result == False
