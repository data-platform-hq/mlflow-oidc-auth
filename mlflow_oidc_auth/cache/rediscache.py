import os

CACHE_TYPE = "RedisCache"
CACHE_DEFAULT_TIMEOUT = os.environ.get("CACHE_DEFAULT_TIMEOUT", 300)
CACHE_KEY_PREFIX = os.environ.get("CACHE_KEY_PREFIX", "mlflow_oidc:")
CACHE_REDIS_HOST = os.environ.get("CACHE_REDIS_HOST", "localhost")
CACHE_REDIS_PORT = os.environ.get("CACHE_REDIS_PORT", 6379)
CACHE_REDIS_PASSWORD = os.environ.get("CACHE_REDIS_PASSWORD", None)
CACHE_REDIS_DB = os.environ.get("CACHE_REDIS_DB", 4)
