from typing import List, Optional

from sqlalchemy.exc import IntegrityError, MultipleResultsFound, NoResultFound
from sqlalchemy.orm import sessionmaker
from werkzeug.security import check_password_hash, generate_password_hash

from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import (
    INVALID_STATE,
    RESOURCE_ALREADY_EXISTS,
    RESOURCE_DOES_NOT_EXIST,
)
from mlflow_oidc_auth.db import utils as dbutils
from mlflow_oidc_auth.db.models import (
    SqlExperimentPermission,
    SqlRegisteredModelPermission,
    SqlUser,
    SqlGroup,
    SqlUserGroup,
)
from mlflow_oidc_auth.entities import (
    ExperimentPermission,
    RegisteredModelPermission,
    User,
)
from mlflow_oidc_auth.permissions import _validate_permission
from mlflow.store.db.utils import (
    _get_managed_session_maker,
    create_sqlalchemy_engine_with_retry,
)
from mlflow.utils.uri import extract_db_type_from_uri
from mlflow.utils.validation import _validate_username


class SqlAlchemyStore:
    def init_db(self, db_uri):
        self.db_uri = db_uri
        self.db_type = extract_db_type_from_uri(db_uri)
        self.engine = create_sqlalchemy_engine_with_retry(db_uri)
        dbutils.migrate_if_needed(self.engine, "head")
        SessionMaker = sessionmaker(bind=self.engine)
        self.ManagedSessionMaker = _get_managed_session_maker(SessionMaker, self.db_type)

    def authenticate_user(self, username: str, password: str) -> bool:
        with self.ManagedSessionMaker() as session:
            try:
                user = self._get_user(session, username)
                return check_password_hash(user.password_hash, password)
            except MlflowException:
                return False

    def create_user(self, username: str, password: str, display_name: str, is_admin: bool = False) -> User:
        _validate_username(username)
        pwhash = generate_password_hash(password)
        with self.ManagedSessionMaker() as session:
            try:
                user = SqlUser(username=username, password_hash=pwhash, is_admin=is_admin, display_name=display_name)
                session.add(user)
                session.flush()
                return user.to_mlflow_entity()
            except IntegrityError as e:
                raise MlflowException(
                    f"User (username={username}) already exists. Error: {e}",
                    RESOURCE_ALREADY_EXISTS,
                ) from e

    @staticmethod
    def _get_user(session, username: str) -> SqlUser:
        try:
            return session.query(SqlUser).filter(SqlUser.username == username).one()
        except NoResultFound:
            raise MlflowException(
                f"User with username={username} not found",
                RESOURCE_DOES_NOT_EXIST,
            )
        except MultipleResultsFound:
            raise MlflowException(
                f"Found multiple users with username={username}",
                INVALID_STATE,
            )

    def has_user(self, username: str) -> bool:
        with self.ManagedSessionMaker() as session:
            return session.query(SqlUser).filter(SqlUser.username == username).first() is not None

    def get_user(self, username: str) -> User:
        with self.ManagedSessionMaker() as session:
            return self._get_user(session, username).to_mlflow_entity()

    def list_users(self) -> List[User]:
        with self.ManagedSessionMaker() as session:
            users = session.query(SqlUser).all()
            return [u.to_mlflow_entity() for u in users]

    def update_user(
        self,
        username: str,
        password: Optional[str] = None,
        is_admin: Optional[bool] = None,
    ) -> User:
        with self.ManagedSessionMaker() as session:
            user = self._get_user(session, username)
            if password is not None:
                pwhash = generate_password_hash(password)
                user.password_hash = pwhash
            if is_admin is not None:
                user.is_admin = is_admin
            return user.to_mlflow_entity()

    def delete_user(self, username: str):
        with self.ManagedSessionMaker() as session:
            user = self._get_user(session, username)
            session.delete(user)

    def create_experiment_permission(self, experiment_id: str, username: str, permission: str) -> ExperimentPermission:
        _validate_permission(permission)
        with self.ManagedSessionMaker() as session:
            try:
                user = self._get_user(session, username=username)
                perm = SqlExperimentPermission(experiment_id=experiment_id, user_id=user.id, permission=permission)
                session.add(perm)
                session.flush()
                return perm.to_mlflow_entity()
            except IntegrityError as e:
                raise MlflowException(
                    f"Experiment permission (experiment_id={experiment_id}, username={username}) "
                    f"already exists. Error: {e}",
                    RESOURCE_ALREADY_EXISTS,
                )

    def _get_experiment_permission(self, session, experiment_id: str, username: str) -> SqlExperimentPermission:
        try:
            user = self._get_user(session, username=username)
            return (
                session.query(SqlExperimentPermission)
                .filter(
                    SqlExperimentPermission.experiment_id == experiment_id,
                    SqlExperimentPermission.user_id == user.id,
                )
                .one()
            )
        except NoResultFound:
            raise MlflowException(
                f"Experiment permission with experiment_id={experiment_id} and " f"username={username} not found",
                RESOURCE_DOES_NOT_EXIST,
            )
        except MultipleResultsFound:
            raise MlflowException(
                f"Found multiple experiment permissions with experiment_id={experiment_id} " f"and username={username}",
                INVALID_STATE,
            )

    def get_experiment_permission(self, experiment_id: str, username: str) -> ExperimentPermission:
        with self.ManagedSessionMaker() as session:
            return self._get_experiment_permission(session, experiment_id, username).to_mlflow_entity()

    def list_experiment_permissions(self, username: str) -> List[ExperimentPermission]:
        with self.ManagedSessionMaker() as session:
            user = self._get_user(session, username=username)
            perms = session.query(SqlExperimentPermission).filter(SqlExperimentPermission.user_id == user.id).all()
            return [p.to_mlflow_entity() for p in perms]

    def update_experiment_permission(self, experiment_id: str, username: str, permission: str) -> ExperimentPermission:
        _validate_permission(permission)
        with self.ManagedSessionMaker() as session:
            perm = self._get_experiment_permission(session, experiment_id, username)
            perm.permission = permission
            return perm.to_mlflow_entity()

    def delete_experiment_permission(self, experiment_id: str, username: str):
        with self.ManagedSessionMaker() as session:
            perm = self._get_experiment_permission(session, experiment_id, username)
            session.delete(perm)

    def create_registered_model_permission(self, name: str, username: str, permission: str) -> RegisteredModelPermission:
        _validate_permission(permission)
        with self.ManagedSessionMaker() as session:
            try:
                user = self._get_user(session, username=username)
                perm = SqlRegisteredModelPermission(name=name, user_id=user.id, permission=permission)
                session.add(perm)
                session.flush()
                return perm.to_mlflow_entity()
            except IntegrityError as e:
                raise MlflowException(
                    f"Registered model permission (name={name}, username={username}) " f"already exists. Error: {e}",
                    RESOURCE_ALREADY_EXISTS,
                )

    def _get_registered_model_permission(self, session, name: str, username: str) -> SqlRegisteredModelPermission:
        try:
            user = self._get_user(session, username=username)
            return (
                session.query(SqlRegisteredModelPermission)
                .filter(
                    SqlRegisteredModelPermission.name == name,
                    SqlRegisteredModelPermission.user_id == user.id,
                )
                .one()
            )
        except NoResultFound:
            raise MlflowException(
                f"Registered model permission with name={name} and username={username} not found",
                RESOURCE_DOES_NOT_EXIST,
            )
        except MultipleResultsFound:
            raise MlflowException(
                f"Found multiple registered model permissions with name={name} " f"and username={username}",
                INVALID_STATE,
            )

    def get_registered_model_permission(self, name: str, username: str) -> RegisteredModelPermission:
        with self.ManagedSessionMaker() as session:
            return self._get_registered_model_permission(session, name, username).to_mlflow_entity()

    def list_registered_model_permissions(self, username: str) -> List[RegisteredModelPermission]:
        with self.ManagedSessionMaker() as session:
            user = self._get_user(session, username=username)
            perms = session.query(SqlRegisteredModelPermission).filter(SqlRegisteredModelPermission.user_id == user.id).all()
            return [p.to_mlflow_entity() for p in perms]

    def update_registered_model_permission(self, name: str, username: str, permission: str) -> RegisteredModelPermission:
        _validate_permission(permission)
        with self.ManagedSessionMaker() as session:
            perm = self._get_registered_model_permission(session, name, username)
            perm.permission = permission
            return perm.to_mlflow_entity()

    def delete_registered_model_permission(self, name: str, username: str):
        with self.ManagedSessionMaker() as session:
            perm = self._get_registered_model_permission(session, name, username)
            session.delete(perm)

    def list_experiment_permissions_for_experiment(self, experiment_id: str):
        with self.ManagedSessionMaker() as session:
            perms = session.query(SqlExperimentPermission).filter(SqlExperimentPermission.experiment_id == experiment_id).all()
            return [p.to_mlflow_entity() for p in perms]

    def populate_groups(self, group_names: List[str]):
        with self.ManagedSessionMaker() as session:
            for group_name in group_names:
                group = session.query(SqlGroup).filter(SqlGroup.group_name == group_name).first()
                if group is None:
                    group = SqlGroup(group_name=group_name)
                    session.add(group)
            session.flush()

    def get_groups(self) -> List[str]:
        with self.ManagedSessionMaker() as session:
            groups = session.query(SqlGroup).all()
            return [g.group_name for g in groups]

    def get_group_users(self, group_name: str) -> List[str]:
        with self.ManagedSessionMaker() as session:
            group = session.query(SqlGroup).filter(SqlGroup.group_name == group_name).one()
            user_groups = session.query(SqlUserGroup).filter(SqlUserGroup.group_id == group.id).all()
            users = session.query(SqlUser).filter(SqlUser.id.in_([ug.user_id for ug in user_groups])).all()
            return [u.username for u in users]

    def add_user_to_group(self, username: str, group_name: str):
        with self.ManagedSessionMaker() as session:
            user = self._get_user(session, username)
            group = session.query(SqlGroup).filter(SqlGroup.group_name == group_name).one()
            user_group = SqlUserGroup(user_id=user.id, group_id=group.id)
            session.add(user_group)
            session.flush()

    def remove_user_from_group(self, username: str, group_name: str):
        with self.ManagedSessionMaker() as session:
            user = self._get_user(session, username)
            group = session.query(SqlGroup).filter(SqlGroup.group_name == group_name).one()
            user_group = (
                session.query(SqlUserGroup).filter(SqlUserGroup.user_id == user.id, SqlUserGroup.group_id == group.id).one()
            )
            session.delete(user_group)
            session.flush()

    def get_groups_for_user(self, username: str) -> List[str]:
        with self.ManagedSessionMaker() as session:
            user = self._get_user(session, username)
            user_groups = session.query(SqlUserGroup).filter(SqlUserGroup.user_id == user.id).all()
            return [ug.group.group_name for ug in user_groups]

    # assign user to groups and remove from other groups
    def set_user_groups(self, username: str, group_names: List[str]):
        with self.ManagedSessionMaker() as session:
            user = self._get_user(session, username)
            user_groups = session.query(SqlUserGroup).filter(SqlUserGroup.user_id == user.id).all()
            for ug in user_groups:
                session.delete(ug)
            for group_name in group_names:
                group = session.query(SqlGroup).filter(SqlGroup.group_name == group_name).one()
                user_group = SqlUserGroup(user_id=user.id, group_id=group.id)
                session.add(user_group)
            session.flush()

    def get_group_experiments(self, group_name: str) -> List[str]:
        with self.ManagedSessionMaker() as session:
            group = session.query(SqlGroup).filter(SqlGroup.group_name == group_name).one()
            perms = session.query(SqlExperimentPermission).filter(SqlExperimentPermission.group_id == group.id).all()
            return [p.experiment_id for p in perms]

    def create_group_experiment_permission(self, group_name: str, experiment_id: str, permission: str):
        _validate_permission(permission)
        with self.ManagedSessionMaker() as session:
            group = session.query(SqlGroup).filter(SqlGroup.group_name == group_name).one()
            perm = SqlExperimentPermission(experiment_id=experiment_id, group_id=group.id, permission=permission)
            session.add(perm)
            session.flush()
            return perm.to_mlflow_entity()

    def delete_group_experiment_permission(self, group_name: str, experiment_id: str):
        with self.ManagedSessionMaker() as session:
            group = session.query(SqlGroup).filter(SqlGroup.group_name == group_name).one()
            perm = (
                session.query(SqlExperimentPermission)
                .filter(SqlExperimentPermission.experiment_id == experiment_id, SqlExperimentPermission.group_id == group.id)
                .one()
            )
            session.delete(perm)
            session.flush()

    def update_group_experiment_permission(self, group_name: str, experiment_id: str, permission: str):
        _validate_permission(permission)
        with self.ManagedSessionMaker() as session:
            group = session.query(SqlGroup).filter(SqlGroup.group_name == group_name).one()
            perm = (
                session.query(SqlExperimentPermission)
                .filter(SqlExperimentPermission.experiment_id == experiment_id, SqlExperimentPermission.group_id == group.id)
                .one()
            )
            perm.permission = permission
            session.flush()
            return perm.to_mlflow_entity()

    def get_group_models(self, group_name: str) -> List[str]:
        with self.ManagedSessionMaker() as session:
            group = session.query(SqlGroup).filter(SqlGroup.group_name == group_name).one()
            perms = session.query(SqlRegisteredModelPermission).filter(SqlRegisteredModelPermission.group_id == group.id).all()
            return [p.name for p in perms]

    def create_group_model_permission(self, group_name: str, name: str, permission: str):
        _validate_permission(permission)
        with self.ManagedSessionMaker() as session:
            group = session.query(SqlGroup).filter(SqlGroup.group_name == group_name).one()
            perm = SqlRegisteredModelPermission(name=name, group_id=group.id, permission=permission)
            session.add(perm)
            session.flush()
            return perm.to_mlflow_entity()

    def delete_group_model_permission(self, group_name: str, name: str):
        with self.ManagedSessionMaker() as session:
            group = session.query(SqlGroup).filter(SqlGroup.group_name == group_name).one()
            perm = (
                session.query(SqlRegisteredModelPermission)
                .filter(SqlRegisteredModelPermission.name == name, SqlRegisteredModelPermission.group_id == group.id)
                .one()
            )
            session.delete(perm)
            session.flush()

    def update_group_model_permission(self, group_name: str, name: str, permission: str):
        _validate_permission(permission)
        with self.ManagedSessionMaker() as session:
            group = session.query(SqlGroup).filter(SqlGroup.group_name == group_name).one()
            perm = (
                session.query(SqlRegisteredModelPermission)
                .filter(SqlRegisteredModelPermission.name == name, SqlRegisteredModelPermission.group_id == group.id)
                .one()
            )
            perm.permission = permission
            session.flush()
            return perm.to_mlflow_entity()
