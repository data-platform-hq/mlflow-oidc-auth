import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TableActionEvent, TableActionModel, TableColumnConfigModel } from './table.interface';

@Component({
  selector: 'ml-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<T> implements OnInit, OnChanges {
  @Input() columnConfig: TableColumnConfigModel[] = [];
  @Input() data: T[] = [];
  @Input() actions: TableActionModel[] = [];

  @Output() action = new EventEmitter<TableActionEvent<T>>();

  dataSource: MatTableDataSource<T> = new MatTableDataSource<T>();
  columns: string[] = [];

  constructor() {
  }

  ngOnChanges(changes:SimpleChanges): void {
    if (changes['data'].currentValue) {
      this.dataSource = new MatTableDataSource(this.data);
    }
  }

  ngOnInit(): void {
    const columnKeys = this.columnConfig.map(config => config.key);

    this.dataSource = new MatTableDataSource(this.data);
    this.columns = columnKeys;
    this.actions.length
      ? this.columns = ['actions', ...columnKeys]
      : this.columns = columnKeys;
  }


  filter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.dataSource.filter = inputElement.value.trim().toLowerCase();
  }

  handleActionClick(item: T, action: TableActionModel) {
    this.action.emit({ item, action });
  }
}
