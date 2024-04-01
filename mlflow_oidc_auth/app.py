import os

from mlflow.server import app
from flask_session import Session

from mlflow_oidc_auth import routes, views
from mlflow_oidc_auth.config import AppConfig

# Configure custom Flask app
template_dir = os.path.dirname(__file__)
template_dir = os.path.join(template_dir, "templates")

app.config.from_object(AppConfig)
app.secret_key = app.config["SECRET_KEY"].encode("utf8")
app.template_folder = template_dir

# Add new routes
app.add_url_rule(rule=routes.LOGIN, methods=["GET"], view_func=views.login)
app.add_url_rule(rule=routes.LOGOUT, methods=["GET", "POST"], view_func=views.logout)
app.add_url_rule(
    rule=routes.CALLBACK, methods=["GET", "POST"], view_func=views.callback
)
app.add_url_rule(rule=routes.STATIC, methods=["GET"], view_func=views.oidc_static)
app.add_url_rule(rule=routes.OIDC_HOME, methods=["GET"], view_func=views.oidc_home)
app.add_url_rule(
    rule=routes.SEARCH_MODEL, methods=["GET"], view_func=views.search_model
)
app.add_url_rule(
    rule=routes.SEARCH_EXPERIMENT, methods=["POST"], view_func=views.create_user
)
# app.add_url_rule(routes.LOGIN_MLFLOW, methods=['POST'], view_func=views.login_mlflow)
app.add_url_rule(rule=routes.PERMISSIONS, methods=["GET"], view_func=views.permissions)
app.add_url_rule(
    rule=routes.PERMISSIONS_USERS, methods=["GET"], view_func=views.permissions_users
)
app.add_url_rule(
    rule=routes.PERMISSIONS_EXPERIMENTS,
    methods=["GET"],
    view_func=views.permissions_experiments,
)
app.add_url_rule(
    rule=routes.PERMISSIONS_MODELS, methods=["GET"], view_func=views.permissions_models
)
app.add_url_rule(
    rule=routes.PERMISSIONS_USER_DETAILS,
    methods=["GET"],
    view_func=views.permissions_user_details,
)
app.add_url_rule(
    rule=routes.PERMISSIONS_EXPERIMENT_DETAILS,
    methods=["GET"],
    view_func=views.permissions_experiment_details,
)
app.add_url_rule(
    rule=routes.PERMISSIONS_MODEL_DETAILS,
    methods=["GET"],
    view_func=views.permissions_model_details,
)
app.add_url_rule(
    rule=routes.GET_EXPERIMENT_PERMISSION,
    methods=["GET"],
    view_func=views.get_experiment_permission,
)
app.add_url_rule(
    rule=routes.UPDATE_USER_PASSWORD,
    methods=["GET"],
    view_func=views.update_username_password,
)
app.add_url_rule(rule=routes.GET_USER, methods=["GET"], view_func=views.get_user)
app.add_url_rule(
    rule=routes.UPDATE_EXPERIMENT_PERMISSION,
    methods=["POST"],
    view_func=views.update_experiment_permission,
)
app.add_url_rule(
    rule=routes.UPDATE_REGISTERED_MODEL_PERMISSION,
    methods=["POST"],
    view_func=views.update_model_permission,
)

# Add new hooks
app.before_request(views.before_request_hook)

# Set up session
Session(app)
