from setuptools import find_packages, setup

setup(
    name="mlflow-oidc-auth",
    version="0.0.1",
    description="OIDC auth plugin for MLflow",
    packages=find_packages(),
    install_requires=open("requirements.txt").read().splitlines(),
    entry_points={
        "mlflow.app": "oidc-auth=mlflow_oidc_auth.app:app",
    },
)
