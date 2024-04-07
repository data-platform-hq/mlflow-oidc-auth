import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DataService } from 'src/app/shared/services';
import { TableActionEvent, TableActionModel } from 'src/app/shared/components/table/table.interface';
import { ExperimentModel } from 'src/app/shared/interfaces/data.interfaces';
import { TableActionEnum } from 'src/app/shared/components/table/table.config';
import { COLUMN_CONFIG, TABLE_ACTIONS } from './experiment-permissions.config';


@Component({
  selector: 'ml-experiment-permissions',
  templateUrl: './experiment-permissions.component.html',
  styleUrls: ['./experiment-permissions.component.scss']
})
export class ExperimentPermissionsComponent implements OnInit {
  columnConfig = COLUMN_CONFIG;
  dataSource: ExperimentModel[] = [];
  actions: TableActionModel[] = TABLE_ACTIONS;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.dataService.getAllExperiments()
      .subscribe((experiments) => this.dataSource = experiments);
  }

  handleActions(event: TableActionEvent<ExperimentModel>) {
    const actionMapping: { [key: string]: any } = {
      [TableActionEnum.EDIT]: this.handleExperimentEdit.bind(this),
    }

    const selectedAction = actionMapping[event.action.action];
    if (selectedAction) {
      selectedAction(event.item);
    }
  }

  handleExperimentEdit({ id }: ExperimentModel) {
    this.router.navigate(['../experiment/' + id], { relativeTo: this.route })
  }
}
