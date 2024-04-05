import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../../../shared/services';
import { TableActionEvent, TableActionModel } from '../../../../../shared/components/table/table.interface';
import { ModelModel } from '../../../../../shared/interfaces/data.interfaces';

enum ModelActionsEnum {
  EDIT = 'EDIT',
}

@Component({
  selector: 'ml-model-permissions',
  templateUrl: './model-permissions.component.html',
  styleUrls: ['./model-permissions.component.scss'],
})
export class ModelPermissionsComponent implements OnInit {
  columnConfig = [{
    title: 'Model name',
    key: 'name',
  }];

  dataSource: ModelModel[] = [];
  actions: TableActionModel[] = [{ action: ModelActionsEnum.EDIT, icon: 'edit', name: 'Edit' }];

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
      [ModelActionsEnum.EDIT]: this.handleModelEdit.bind(this),
    };

    const selectedAction = actionMapping[action.action];
    if (selectedAction) {
      selectedAction(item);
    }
  }
}
