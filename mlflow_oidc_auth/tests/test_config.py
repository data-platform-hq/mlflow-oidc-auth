from unittest import mock


"""
AppConfig initiates it's values on import.
This test is to ensure that all expected properties are present.
"""


class TestAppConfig:
    MOCK_OIDC_RESPONSE = {
        "authorization_endpoint": "https://example.com/auth",
        "token_endpoint": "https://example.com/token",
        "userinfo_endpoint": "https://example.com/userinfo",
    }
    MOCK_OIDC_DISCOVERY_URL = "https://example.com/.well-known/openid-configuration"

    @mock.patch("requests.get")
    def test_ext_call(self, mock_get, monkeypatch):
        mock_response = mock_get.return_value
        mock_response.json.return_value = self.MOCK_OIDC_RESPONSE
        monkeypatch.setenv("OIDC_DISCOVERY_URL", self.MOCK_OIDC_DISCOVERY_URL)

        from mlflow_oidc_auth.config import AppConfig

        conf = AppConfig

        mock_get.assert_called_once_with(self.MOCK_OIDC_DISCOVERY_URL)
        assert conf.OIDC_AUTHORIZATION_URL == self.MOCK_OIDC_RESPONSE["authorization_endpoint"]
        assert conf.OIDC_TOKEN_URL == self.MOCK_OIDC_RESPONSE["token_endpoint"]
        assert conf.OIDC_USER_URL == self.MOCK_OIDC_RESPONSE["userinfo_endpoint"]

    def test_configurations_presented(self):
        from mlflow_oidc_auth.config import AppConfig

        assert len(AppConfig.SECRET_KEY) == 16 * 2  # 16 bytes in hex

        assert all(
            conf is not None
            for conf in [
                AppConfig.DEFAULT_MLFLOW_PERMISSION,
                AppConfig.SESSION_TYPE,
                AppConfig.OIDC_USERS_DB_URI,
                AppConfig.OIDC_GROUP_NAME,
                AppConfig.OIDC_ADMIN_GROUP_NAME,
                AppConfig.OIDC_PROVIDER_DISPLAY_NAME,
                AppConfig.OIDC_GROUPS_ATTRIBUTE,
                AppConfig.OIDC_SCOPE,
            ]
        )

        assert all(
            conf is None
            for conf in [
                AppConfig.OIDC_GROUP_DETECTION_PLUGIN,
                AppConfig.OIDC_REDIRECT_URI,
                AppConfig.OIDC_CLIENT_ID,
                AppConfig.OIDC_CLIENT_SECRET,
            ]
        )

    def test_get_property(self):
        from mlflow_oidc_auth.config import AppConfig

        assert AppConfig.get_property("SECRET_KEY") == AppConfig.SECRET_KEY
        assert AppConfig.get_property("THIS_PROPERTY_DOES_NOT_EXIST") is None
