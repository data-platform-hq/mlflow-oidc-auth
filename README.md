# mlflow-oidc-auth
Mlflow auth plugin to use OpenID Connect (OIDC) as authentication and authorization provider

To get it just do ```pip install mlflow-oidc-auth``` (mlflow will come as a dependency)

# Configuration
The plugin required the following environment variables but also supported `.env` file

| Parameter | Description|
|---|---|
| OIDC_REDIRECT_URI      |  Application redirect/callback url (https://example.com/callback) |
| OIDC_DISCOVERY_URL     | OIDC Discovery URL |
| OIDC_CLIENT_SECRET     | OIDC Client Secret |
| OIDC_CLIENT_ID         |  OIDC Client ID |
| OIDC_PROVIDER_TYPE | can be 'oidc' or 'microsoft' |
| OIDC_PROVIDER_DISPLAY_NAME | any text to display |
| OIDC_SCOPE | OIDC scope |
| OIDC_GROUP_NAME | User group name to be allowed login to MLFlow, currently supported groups in OIDC claims and Microsoft Entra ID groups |
| OIDC_ADMIN_GROUP_NAME | User group name to be allowed login to MLFlow manage and define permissions, currently supported groups in OIDC claims and Microsoft Entra ID groups |
| OIDC_AUTHORIZATION_URL | OIDC Auth URL (if discovery URL is not defined) |
| OIDC_TOKEN_URL         | OIDC Token URL (if discovery URL is not defined) |
| OIDC_USER_URL          | OIDC User info URL (if discovery URL is not defined) |
| SECRET_KEY             | Key to perform cookie encryption |
| OAUTHLIB_INSECURE_TRANSPORT | Development only. Allow to use insecure endpoints for OIDC |
| LOG_LEVEL                   | Application log level |
| OIDC_USERS_DB_URI | Database connection string |

# Configuration examples

## Okta

```bash
OIDC_DISCOVERY_URL = 'https://<your_domain>.okta.com/.well-known/openid-configuration'
OIDC_CLIENT_SECRET ='<super_secret>'
OIDC_CLIENT_ID ='<client_id>'
OIDC_PROVIDER_TYPE = 'oidc'
OIDC_PROVIDER_DISPLAY_NAME = "Login with Okta"
OIDC_SCOPE = "openid,profile,email,groups"
OIDC_GROUP_NAME = "mlflow-users-group-name"
OIDC_ADMIN_GROUP_NAME = "mlflow-admin-group-name"
```

## Microsoft Entra ID

```bash
OIDC_DISCOVERY_URL = 'https://login.microsoftonline.com/<tenant_id>/v2.0/.well-known/openid-configuration'
OIDC_CLIENT_SECRET = '<super_secret>'
OIDC_CLIENT_ID = '<client_id>'
OIDC_PROVIDER_TYPE = 'microsoft'
OIDC_PROVIDER_DISPLAY_NAME = "Login with Microsoft"
OIDC_SCOPE = "openid,profile,email"
OIDC_GROUP_NAME = "mlflow_users_group_name"
OIDC_ADMIN_GROUP_NAME = "mlflow_admins_group_name"
```

> please note, that for getting group membership information, the application should have "GroupMember.Read.All" permission

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
