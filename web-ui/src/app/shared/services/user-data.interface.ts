export interface CurrentUserModel {
  display_name: string;
  experiment_permissions: ExperimentPermission[];
  id: number;
  is_admin: boolean;
  registered_model_permissions: RegisteredModelPermission[];
  username: string;
}

export interface ExperimentPermission {
  id: string;
  name: string;
  permission: string;
}

export interface RegisteredModelPermission {
  name: string;
  permission: string;
  user_id: number;
}
