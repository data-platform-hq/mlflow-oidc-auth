import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, switchMap } from 'rxjs';

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
import { ExperimentsDataService, ModelsDataService, PermissionDataService } from 'src/app/shared/services';
import { PermissionModalService } from 'src/app/shared/services/permission-modal.service';

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
    private readonly modelDataService: ModelsDataService,
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
      .pipe(
        switchMap((experiments) => this.permissionModalService.openGrantExperimentPermissionModal(experiments, this.groupName)),
        filter(Boolean),
        switchMap((newPermission) => this.permissionDataService.addExperimentPermissionToGroup(this.groupName, newPermission.entity.id, newPermission.permission)),
        switchMap(() => this.groupDataService.getAllExperimentsForGroup(this.groupName)),
      )
      .subscribe((experiments) => this.experimentDataSource = experiments);
  }

  openModalAddModelPermissionToGroup() {
    this.permissionModalService.openGrantModelPermissionModal(this.groupName)
      .pipe(
        filter(Boolean),
        switchMap((newPermission) => this.permissionDataService.addModelPermissionToGroup(newPermission.entity.name, this.groupName, newPermission.permission)),
        switchMap(() => this.groupDataService.getAllRegisteredModelsForGroup(this.groupName)),
      )
      .subscribe((models) => this.modelDataSource = models);
  }
}
