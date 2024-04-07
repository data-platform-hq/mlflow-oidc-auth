import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DataService } from 'src/app/shared/services';
import { TableActionEvent, TableActionModel } from 'src/app/shared/components/table/table.interface';
import { ModelModel } from 'src/app/shared/interfaces/data.interfaces';
import { MODEL_COLUMN_CONFIG, MODEL_TABLE_ACTIONS } from './model-permissions.config';
import { TableActionEnum } from 'src/app/shared/components/table/table.config';

@Component({
  selector: 'ml-model-permissions',
  templateUrl: './model-permissions.component.html',
  styleUrls: ['./model-permissions.component.scss'],
})
export class ModelPermissionsComponent implements OnInit {
  columnConfig = MODEL_COLUMN_CONFIG;
  dataSource: ModelModel[] = [];
  actions: TableActionModel[] = MODEL_TABLE_ACTIONS;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
  ) {
  }

  ngOnInit(): void {
    this.dataService.getAllModels()
      .subscribe((models) => {
        this.dataSource = models;
      })
  }

  handleModelEdit({ name }: ModelModel) {
    this.router.navigate(['../model/' + name], { relativeTo: this.route })
  }

  handleAction({ action, item }: TableActionEvent<ModelModel>) {
    const actionMapping: { [key: string]: any } = {
      [TableActionEnum.EDIT]: this.handleModelEdit.bind(this),
    };

    const selectedAction = actionMapping[action.action];
    if (selectedAction) {
      selectedAction(item);
    }
  }
}
