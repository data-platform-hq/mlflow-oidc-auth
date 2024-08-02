import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  TableActionEvent,
  TableActionModel,
  TableColumnConfigModel,
} from 'src/app/shared/components/table/table.interface';
import { GroupDataService } from 'src/app/shared/services/data/group-data.service';
import {
  EXPERIMENT_ACTIONS,
  EXPERIMENT_COLUMN_CONFIG,
  MODELS_ACTIONS,
  MODELS_COLUMN_CONFIG,
} from './group-permission-details.config';
import { ExperimentModel, ModelModel } from 'src/app/shared/interfaces/groups-data.interface';
import { ExperimentsDataService, PermissionDataService } from '../../../../../shared/services';
import { PermissionModalService } from '../../../../../shared/services/permission-modal.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'ml-group-permission-details',
  templateUrl: './group-permission-details.component.html',
  styleUrls: ['./group-permission-details.component.scss']
})
export class GroupPermissionDetailsComponent implements OnInit {
  groupName = '';

  experimentColumnConfig: TableColumnConfigModel[] = EXPERIMENT_COLUMN_CONFIG;
  experimentDataSource: ExperimentModel[] = [];
  experimentActions: TableActionModel[] = EXPERIMENT_ACTIONS

  modelColumnConfig: TableColumnConfigModel[] = MODELS_COLUMN_CONFIG;
  modelDataSource: ModelModel[] = [];
  modelActions: TableActionModel[] = MODELS_ACTIONS;

  constructor(
    private readonly groupDataService: GroupDataService,
    private readonly route: ActivatedRoute,
    private readonly permissionDataService: PermissionDataService,
    private readonly permissionModalService: PermissionModalService,
    private readonly experimentsDataService: ExperimentsDataService,
  ) { }

  ngOnInit(): void {
    this.groupName = this.route.snapshot.paramMap.get('id') ?? '';

    this.groupDataService.getAllExperimentsForGroup(this.groupName)
      .subscribe((experiments) => this.experimentDataSource = experiments);
    this.groupDataService.getAllRegisteredModelsForGroup(this.groupName)
      .subscribe((models) => this.modelDataSource = models);
  }

  handleGroupActions($event: TableActionEvent<any>) {

  }

  addExperimentPermissionToGroup() {
    // this.permissionDataService.addExperimentPermissionToGroup(this.groupName, )
  }

  addModelPermissionToGroup() {

  }

  openModalAddExperimentPermissionToGroup() {
    this.experimentsDataService.getAllExperiments()
    .subscribe((experiments) => this.permissionModalService.openGrantExperimentPermissionModal(experiments, this.groupName));
  }
}
