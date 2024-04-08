import { PermissionEnum } from '../../core/configs/permissions';

export interface ExperimentModel {
  id: string;
  name: string;
  tags: Record<string, unknown>;
}


export interface ExperimentsForUserModel {
  experiments: ExperimentForUserModel[]
}

interface ExperimentForUserModel {
  id: string,
  name: string,
  permissions: string,
}


export interface UserPermissionModel {
  permission: PermissionEnum;
  username: string;
}
