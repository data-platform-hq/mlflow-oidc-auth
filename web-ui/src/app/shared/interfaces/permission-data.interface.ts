export interface CreateExperimentPermissionRequestBodyModel {
  experiment_name?: string;
  experiment_id?: string;
  user_name: string;
  new_permission: string;
}

export interface CreateModelPermissionRequestBodyModel {
  model_name: string;
  user_name: string;
  new_permission: string;
}
