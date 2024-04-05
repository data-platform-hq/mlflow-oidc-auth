export interface TableActionModel {
  icon: string;
  name: string;
  action: string;
}

export interface TableActionEvent<T> {
  item: T;
  action: TableActionModel;
}

export interface TableColumnConfigModel {
  title: string,
  key: string
}
