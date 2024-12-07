from mlflow_oidc_auth.sqlalchemy_store import SqlAlchemyStore
from mlflow_oidc_auth.config import config

store = SqlAlchemyStore()
store.init_db(config.OIDC_USERS_DB_URI)
