import { EntityEnum } from 'src/app/core/configs/core';

export interface GrantPermissionModalData {
  permissionAssignedTo: string;
  entityType: EntityEnum;
  entities: string[];
}
