# Okta



## Configuration example

```bash
OIDC_DISCOVERY_URL = 'https://<your_domain>.okta.com/.well-known/openid-configuration'
OIDC_CLIENT_SECRET ='<super_secret>'
OIDC_CLIENT_ID ='<client_id>'
OIDC_PROVIDER_DISPLAY_NAME = "Login with Okta"
OIDC_SCOPE = "openid,profile,email,groups"
OIDC_GROUP_NAME = "mlflow-users-group-name"
OIDC_ADMIN_GROUP_NAME = "mlflow-admin-group-name"
```
