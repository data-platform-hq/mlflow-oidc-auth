import os

CACHE_TYPE = "FileSystemCache"
CACHE_DEFAULT_TIMEOUT = os.environ.get("CACHE_DEFAULT_TIMEOUT", 300)
CACHE_IGNORE_ERRORS = os.environ.get("CACHE_IGNORE_ERRORS", str(True)).lower() in ("true", "1", "t")
CACHE_DIR = os.environ.get("CACHE_DIR", "/tmp/flask_cache")
CACHE_THRESHOLD = os.environ.get("CACHE_THRESHOLD", 500)
