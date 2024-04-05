import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../../../shared/services';
import { TableActionEvent, TableActionModel } from '../../../../../shared/components/table/table.interface';
import { ExperimentModel } from '../../../../../shared/interfaces/data.interfaces';

enum ExperimentActionsEnum {
  MANAGE = 'MANAGE',
}

@Component({
  selector: 'ml-experiment-permissions',
  templateUrl: './experiment-permissions.component.html',
  styleUrls: ['./experiment-permissions.component.scss']
})
export class ExperimentPermissionsComponent implements OnInit {
  columnConfig = [{
    title: 'Experiment Name',
    key: 'name'
  }];
  dataSource: ExperimentModel[] = [];
  actions: TableActionModel[] = [
    { action: ExperimentActionsEnum.MANAGE, icon: 'edit', name: 'Edit' },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.dataService.getAllExperiments()
      .subscribe((experiments) => {
        this.dataSource = experiments;
      })
  }

  handleActions(event: TableActionEvent<ExperimentModel>) {
    const actionMapping: { [key: string]: any } = {
      [ExperimentActionsEnum.MANAGE]: this.handleExperimentEdit.bind(this),
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
