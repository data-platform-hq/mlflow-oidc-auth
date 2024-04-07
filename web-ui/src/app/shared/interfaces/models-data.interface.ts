import { PermissionEnum } from 'src/app/core/configs/permissions';

export interface ModelModel {
  aliases: Record<string, unknown>;
  description: string;
  latest_versions: any[];
  name: string;
  tags: Record<string, unknown>;
}


export interface ModelPermissionsModel {
  models: ModelPermissionModel[];
}

export interface ModelPermissionModel {
  name: string;
  permissions: PermissionEnum;
}

export interface ModelUserListModel {
  permission: PermissionEnum;
  username: string;
}

