export interface UserResponseModel {
  display_name: string;
  experiment_permissions: ExperimentModel[];
  id: number;
  is_admin: boolean;
  registered_model_permissions: ModelModel[];
  username: string;
}

export interface ExperimentModel {
  id: string
  name: string;
}

export interface ModelModel {
  id: string
  name: string;
}

export interface ExperimentsResponseModel {
  experiments: {
    id: string,
    name: string,
    permissions: string }[]
}

export interface CreateExperimentPermissionRequestBodyModel {
  experiment_name: string;
  user_name: string;
  new_permission: string;
}

export interface CreateModelPermissionRequestBodyModel {
  "model_name": string;
  "user_name": string;
  "new_permission": string;
}
