from unittest.mock import patch
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from mlflow_oidc_auth.db.utils import migrate


class TestMigrate:
    @patch("mlflow_oidc_auth.db.utils.upgrade")
    def test_migrate(self, mock_upgrade):
        engine = create_engine("sqlite:///:memory:")
        with sessionmaker(bind=engine)():
            migrate(engine, "head")

        mock_upgrade.assert_called_once()
