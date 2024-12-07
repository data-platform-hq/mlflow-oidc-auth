import os

from mlflow.server import app
from flask_session import Session

from mlflow_oidc_auth import routes, views
from mlflow_oidc_auth.config import config
from mlflow_oidc_auth.hooks import before_request_hook, after_request_hook
from flask_caching import Cache

# Configure custom Flask app
template_dir = os.path.dirname(__file__)
template_dir = os.path.join(template_dir, "templates")

app.config.from_object(config)
app.secret_key = app.config["SECRET_KEY"].encode("utf8")
app.template_folder = template_dir
static_folder = app.static_folder

# Add links to MLFlow UI
app.view_functions["serve"] = views.index

# OIDC routes
app.add_url_rule(rule=routes.LOGIN, methods=["GET"], view_func=views.login)
app.add_url_rule(rule=routes.LOGOUT, methods=["GET"], view_func=views.logout)
app.add_url_rule(rule=routes.CALLBACK, methods=["GET"], view_func=views.callback)

# UI routes
app.add_url_rule(rule=routes.STATIC, methods=["GET"], view_func=views.oidc_static)
app.add_url_rule(rule=routes.UI, methods=["GET"], view_func=views.oidc_ui)
app.add_url_rule(rule=routes.UI_ROOT, methods=["GET"], view_func=views.oidc_ui)

# User token
app.add_url_rule(rule=routes.GET_ACCESS_TOKEN, methods=["GET"], view_func=views.create_access_token)
app.add_url_rule(rule=routes.GET_CURRENT_USER, methods=["GET"], view_func=views.get_current_user)

# UI routes support
app.add_url_rule(rule=routes.GET_EXPERIMENTS, methods=["GET"], view_func=views.get_experiments)
app.add_url_rule(rule=routes.GET_MODELS, methods=["GET"], view_func=views.get_registered_models)
app.add_url_rule(rule=routes.GET_USERS, methods=["GET"], view_func=views.get_users)
app.add_url_rule(rule=routes.GET_USER_EXPERIMENTS, methods=["GET"], view_func=views.get_user_experiments)
app.add_url_rule(rule=routes.GET_USER_MODELS, methods=["GET"], view_func=views.get_user_models)
app.add_url_rule(rule=routes.GET_EXPERIMENT_USERS, methods=["GET"], view_func=views.get_experiment_users)
app.add_url_rule(rule=routes.GET_MODEL_USERS, methods=["GET"], view_func=views.get_registered_model_users)

# User management
app.add_url_rule(rule=routes.CREATE_USER, methods=["POST"], view_func=views.create_user)
app.add_url_rule(rule=routes.GET_USER, methods=["GET"], view_func=views.get_user)
app.add_url_rule(rule=routes.UPDATE_USER_PASSWORD, methods=["PATCH"], view_func=views.update_username_password)
app.add_url_rule(rule=routes.UPDATE_USER_ADMIN, methods=["PATCH"], view_func=views.update_user_admin)
app.add_url_rule(rule=routes.DELETE_USER, methods=["DELETE"], view_func=views.delete_user)

# permission management
app.add_url_rule(rule=routes.CREATE_EXPERIMENT_PERMISSION, methods=["POST"], view_func=views.create_experiment_permission)
app.add_url_rule(rule=routes.GET_EXPERIMENT_PERMISSION, methods=["GET"], view_func=views.get_experiment_permission)
app.add_url_rule(rule=routes.UPDATE_EXPERIMENT_PERMISSION, methods=["PATCH"], view_func=views.update_experiment_permission)
app.add_url_rule(rule=routes.DELETE_EXPERIMENT_PERMISSION, methods=["DELETE"], view_func=views.delete_experiment_permission)
app.add_url_rule(
    rule=routes.CREATE_REGISTERED_MODEL_PERMISSION, methods=["POST"], view_func=views.create_registered_model_permission
)
app.add_url_rule(rule=routes.GET_REGISTERED_MODEL_PERMISSION, methods=["GET"], view_func=views.get_registered_model_permission)
app.add_url_rule(
    rule=routes.UPDATE_REGISTERED_MODEL_PERMISSION, methods=["PATCH"], view_func=views.update_registered_model_permission
)
app.add_url_rule(
    rule=routes.DELETE_REGISTERED_MODEL_PERMISSION, methods=["DELETE"], view_func=views.delete_registered_model_permission
)

app.add_url_rule(rule=routes.GET_GROUPS, methods=["GET"], view_func=views.get_groups)
app.add_url_rule(rule=routes.GET_GROUP_USERS, methods=["GET"], view_func=views.get_group_users)
app.add_url_rule(rule=routes.GET_GROUP_EXPERIMENTS_PERMISSION, methods=["GET"], view_func=views.get_group_experiments)
app.add_url_rule(
    rule=routes.CREATE_GROUP_EXPERIMENT_PERMISSION, methods=["POST"], view_func=views.create_group_experiment_permission
)
app.add_url_rule(
    rule=routes.DELETE_GROUP_EXPERIMENT_PERMISSION, methods=["DELETE"], view_func=views.delete_group_experiment_permission
)
app.add_url_rule(
    rule=routes.UPDATE_GROUP_EXPERIMENT_PERMISSION, methods=["PATCH"], view_func=views.update_group_experiment_permission
)
app.add_url_rule(rule=routes.GET_GROUP_MODELS_PERMISSION, methods=["GET"], view_func=views.get_group_models)
app.add_url_rule(rule=routes.CREATE_GROUP_MODEL_PERMISSION, methods=["POST"], view_func=views.create_group_model_permission)
app.add_url_rule(rule=routes.DELETE_GROUP_MODEL_PERMISSION, methods=["DELETE"], view_func=views.delete_group_model_permission)
app.add_url_rule(rule=routes.UPDATE_GROUP_MODEL_PERMISSION, methods=["PATCH"], view_func=views.update_group_model_permission)

# Add new hooks
app.before_request(before_request_hook)
app.after_request(after_request_hook)

# Set up session
Session(app)
cache = Cache(app)
