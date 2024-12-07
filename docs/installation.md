# PyPI

## Recommended option
To get full version (with entire MLFlow, MLFlow UI and all dependencies) run:

```bash
python3 -m pip install mlflow-oidc-auth[full]
```

## Distributed deployment (autoscaling/k8s)

To achieve best experience and allow application scaling you need to install package with caching support

```bash
python3 -m pip install mlflow-oidc-auth[full,caching-redis]
```

## Lightweight installation

To get skinny version run:

```bash
python3 -m pip install mlflow-oidc-auth
```

> Please note: the lightweight installation has no MLFlow UI package because it is not included in the mlflow-skinny version. Please install the full version, or install mlflow w/o dependencies at your own risk.

# Anaconda

Not available yet
