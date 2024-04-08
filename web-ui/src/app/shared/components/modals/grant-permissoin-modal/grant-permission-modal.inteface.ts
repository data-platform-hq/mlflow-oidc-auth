import { EntityEnum } from 'src/app/core/configs/core';

export interface GrantPermissionModalData {
  userName: string;
  entityType: EntityEnum;
  entities: string[];
}
