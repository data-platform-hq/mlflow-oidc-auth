import { EntityEnum } from 'src/app/core/configs/core';

type WithName = {
  id: string;
  name: string;
  [key: string]: any;
};

export interface GrantPermissionModalData {
  permissionAssignedTo: string;
  entityType: EntityEnum;
  entities: WithName[];
}
