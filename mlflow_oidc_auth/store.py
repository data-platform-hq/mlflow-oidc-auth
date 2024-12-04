from mlflow_oidc_auth.sqlalchemy_store import SqlAlchemyStore
from mlflow_oidc_auth.config import AppConfig

store = SqlAlchemyStore()
store.init_db((AppConfig.get_property("OIDC_USERS_DB_URI")))
