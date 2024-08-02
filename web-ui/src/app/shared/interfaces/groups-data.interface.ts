import { PermissionEnum } from 'src/app/core/configs/permissions';

export interface GroupsDataModel {
  groups: string[]
}

export interface ExperimentModel {
  id: string;
  name: string;
  permissions: PermissionEnum;
}

export interface ModelModel {
  name: string;
  permissions: PermissionEnum;
}
