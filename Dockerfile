FROM ghcr.io/mlflow/mlflow

ADD . /app
WORKDIR /app

RUN python -m pip install -r requirements.txt \
    && pip install --editable .
