export interface CreateExperimentPermissionRequestBodyModel {
  experiment_name?: string;
  experiment_id?: string;
  user_name: string;
  permission: string;
}

export interface CreateModelPermissionRequestBodyModel {
  name: string;
  user_name: string;
  permission: string;
}
