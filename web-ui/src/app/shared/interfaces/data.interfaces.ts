
export interface ExperimentModel {
  id: string
  name: string
  permission: number
}

export interface ModelModel {
  name: string;
  permission: string;
  user_id: number;
}

export interface ExperimentsResponseModel {
  experiments: {
    id: string,
    name: string,
    permissions: string,
  }[]
}

export interface ExperimentModel {
  id: string,
  name: string,
  tags: object
}

export interface ModelModel {
  aliases: object,
  description: string,
  latest_versions: any[],
  name: string,
  tags: object,
}

export interface ModelsResponseModel {
  models: {
    name: string,
    permissions: string,
  }[]
}


export interface CreateExperimentPermissionRequestBodyModel {
  experiment_name: string;
  user_name: string;
  new_permission: string;
}

export interface CreateModelPermissionRequestBodyModel {
  model_name: string;
  user_name: string;
  new_permission: string;
}

export interface UsersForModelModel {
  permission: string;
  username: string;
}
