# mlflow-oidc-auth
Mlflow auth plugin to use OpenID Connect (OIDC) as authentication and authorization provider

To get it just do ```pip install mlflow-oidc-auth``` (mlflow will come as a dependency)

# Configuration
The plugin required the following environment variables but also supported `.env` file

| Parameter | Description|
|---|---|
| OIDC_CLIENT_ID         |  OIDC Client ID |
| OIDC_CLIENT_SECRET     | OIDC Client Secret |
| OIDC_REDIRECT_URI      |  Application redirect/callback url (https://example.com/callback) |
| OIDC_DISCOVERY_URL     | OIDC Discovery URL |
| OIDC_AUTHORIZATION_URL | OIDC Auth URL (if discovery URL is not defined) |
| OIDC_TOKEN_URL         | OIDC Token URL (if discovery URL is not defined) |
| OIDC_USER_URL          | OIDC User info URL (if discovery URL is not defined) |
| GROUP_NAME             | User group name to be allowed to login to MLFlow, currently supported groups in OIDC claims and Microsoft Entra ID groups |
| ADMIN_GROUP_NAME       | User group name to be allowed to login to MLFlow manage and define permissions, currently supported groups in OIDC claims and Microsoft Entra ID groups
| SECRET_KEY             | Key to perform cookie encryption |
| OAUTHLIB_INSECURE_TRANSPORT | Development only. Allow to use insecure endpoints for OIDC |
| LOG_LEVEL                   | Application log level |



# Development
```shell
git clone https://github.com/data-platform-hq/mlflow-oidc-auth
cd mlflow-oidc-auth
python3 -m venv venv
source venv/bin/activate
pip install --editable .
mlflow server --dev --app-name oidc-auth --host 0.0.0.0 --port 8080
```


# License
Apache 2 Licensed. For more information please see [LICENSE](./LICENSE)

### Based on MLFlow basic-auth plugin
https://github.com/mlflow/mlflow/tree/master/mlflow/server/auth
