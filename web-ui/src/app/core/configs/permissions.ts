export enum PermissionEnum {
  EDIT = 'EDIT',
  READ = 'READ',
  MANAGE = 'MANAGE',
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
  }
]
