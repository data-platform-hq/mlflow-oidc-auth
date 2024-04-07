export const API_URL = {
  ALL_EXPERIMENTS: '/api/2.0/mlflow/experiments',
  EXPERIMENTS_FOR_USER: '/api/2.0/mlflow/users/${userName}/experiments',
  USERS_FOR_EXPERIMENT: '/api/2.0/mlflow/experiments/${experimentName}/users',
  ALL_MODELS: '/api/2.0/mlflow/registered-models',
  MODELS_FOR_USER: '/api/2.0/mlflow/users/${userName}/registered-models',
  USERS_FOR_MODEL: '/api/2.0/mlflow/registered-models/${modelName}/users',
  CREATE_EXPERIMENT_PERMISSION: '/api/2.0/mlflow/experiments/create',
  CREATE_MODEL_PERMISSION: '/api/2.0/mlflow/registered-models/create',
  UPDATE_EXPERIMENT_PERMISSION: '/api/2.0/mlflow/experiments/permissions/update',
  UPDATE_MODEL_PERMISSION: '/api/2.0/mlflow/registered-models/permissions/update',
  DELETE_EXPERIMENT_PERMISSION: '/api/2.0/mlflow/experiments/permissions/delete',
  DELETE_MODEL_PERMISSION: '/api/2.0/mlflow/registered-models/permissions/delete',

  GET_ALL_USERS: '/api/2.0/mlflow/users',
  GET_ACCESS_TOKEN: '/api/2.0/mlflow/users/access-token',
  GET_CURRENT_USER: '/api/2.0/mlflow/users/current',
};
