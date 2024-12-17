export enum PermissionEnum {
  EDIT = 'EDIT',
  READ = 'READ',
  MANAGE = 'MANAGE',
  NO_PERMISSIONS = 'NO_PERMISSIONS'
}

export enum PermissionTypeEnum {
  USER = 'USER',
  GROUP = 'GROUP',
  FALLBACK = 'FALLBACK',
}

export const PERMISSIONS = [
  {
    value: PermissionEnum.EDIT,
    title: 'Edit'
  },
  {
    value: PermissionEnum.READ,
    title: 'Read'
  },
  {
    value: PermissionEnum.MANAGE,
    title: 'Manage'
  },
  {
    value: PermissionEnum.NO_PERMISSIONS,
    title: 'No permissions'
  }
]
