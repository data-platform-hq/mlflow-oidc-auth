import os

version = os.environ.get("MLFLOW_OIDC_AUTH_VERSION", "0.0.2.dev0")

__version__ = version
