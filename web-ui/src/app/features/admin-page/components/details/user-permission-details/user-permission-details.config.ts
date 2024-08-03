import { TABLE_ACTION_CONFIG } from 'src/app/shared/components/table/table.config';

export const MODEL_COLUMN_CONFIG = [
  { title: 'Model name', key: 'name' },
  { title: 'Permissions', key: 'permission' },
];

export const EXPERIMENT_COLUMN_CONFIG = [
  { title: 'Experiment Name', key: 'name' },
  { title: 'Permission', key: 'permission' },
];

export const EXPERIMENT_ACTIONS = [
  TABLE_ACTION_CONFIG.EDIT,
  TABLE_ACTION_CONFIG.REVOKE,
];

export const MODEL_ACTIONS = [
  TABLE_ACTION_CONFIG.EDIT,
  TABLE_ACTION_CONFIG.REVOKE,
];
