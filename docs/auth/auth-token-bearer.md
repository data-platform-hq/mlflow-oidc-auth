# Bearer Token
You can use bearer token authentication for the auth plugin.
It can be useful in case when your app is located behind some oauth proxy and/or you want to do auth outside of the application.

## Configuration

```
OIDC_DISCOVERY_URL=https://path.to.issuer.url/
```

No more configuration needed. If your request to the MLFlow instance with oidc

## Recommendation
You need to enable caching to improve application performance and avoid cases when the application pull JWKS endpoint every time with incoming request.
