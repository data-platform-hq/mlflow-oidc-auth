import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, forkJoin, switchMap, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { GrantPermissionModalComponent } from 'src/app/shared/components';
import {
  ExperimentsDataService,
  ModelsDataService,
  PermissionDataService,
  SnackBarService,
} from 'src/app/shared/services';
import {
  EXPERIMENT_ACTIONS,
  EXPERIMENT_COLUMN_CONFIG,
  MODEL_ACTIONS,
  MODEL_COLUMN_CONFIG,
} from './user-permission-details.config';
import { EntityEnum } from 'src/app/core/configs/core';
import {
  GrantPermissionModalData,
} from 'src/app/shared/components/modals/grant-permissoin-modal/grant-permission-modal.inteface';
import { TableActionEvent, TableActionModel } from 'src/app/shared/components/table/table.interface';
import { PermissionModalService } from 'src/app/shared/services/permission-modal.service';
import { TableActionEnum } from 'src/app/shared/components/table/table.config';

@Component({
  selector: 'ml-user-permission-details',
  templateUrl: './user-permission-details.component.html',
  styleUrls: ['./user-permission-details.component.scss'],
})
export class UserPermissionDetailsComponent implements OnInit {
  userId: string = '';
  experimentsColumnConfig = EXPERIMENT_COLUMN_CONFIG;
  modelsColumnConfig = MODEL_COLUMN_CONFIG;

  experimentsDataSource: any[] = [];
  modelsDataSource: any[] = [];
  experimentsActions: TableActionModel[] = EXPERIMENT_ACTIONS;
  modelsActions: TableActionModel[] = MODEL_ACTIONS;

  constructor(
    private readonly dialog: MatDialog,
    private readonly expDataService: ExperimentsDataService,
    private readonly modelDataService: ModelsDataService,
    private readonly permissionDataService: PermissionDataService,
    private readonly route: ActivatedRoute,
    private readonly permissionModalService: PermissionModalService,
    private readonly snackBarService: SnackBarService
  ) {
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') ?? '';

    forkJoin([
      this.expDataService.getExperimentsForUser(this.userId),
      this.modelDataService.getModelsForUser(this.userId),
    ])
      .subscribe(([experiments, models]) => {
        this.experimentsDataSource = experiments;
        this.modelsDataSource = models;
      });

  }

  addModelPermissionToUser() {
    this.permissionModalService.openGrantModelPermissionModal(this.userId)
      .pipe(
        filter(Boolean),
        switchMap(({ entity, permission }) => this.permissionDataService.createModelPermission({
          user_name: this.userId,
          name: entity.name,
          permission: permission,
        })),
        tap(() => this.snackBarService.openSnackBar('Permission granted successfully')),
        switchMap(() => this.modelDataService.getModelsForUser(this.userId)),
      )
      .subscribe((models) => this.modelsDataSource = models);
  }

  addExperimentPermissionToUser() {
    this.expDataService.getAllExperiments()
      .pipe(
        switchMap((experiments) => this.dialog.open<GrantPermissionModalComponent, GrantPermissionModalData>(GrantPermissionModalComponent, {
          data: {
            entityType: EntityEnum.EXPERIMENT,
            entities: experiments,
            permissionAssignedTo: this.userId,
          }
        }).afterClosed()
        ),
        filter(Boolean),
        switchMap(({ entity, permission }) => {
          return this.permissionDataService.createExperimentPermission({
            user_name: this.userId,
            experiment_name: entity.name,
            permission: permission,
          })
        }),
        tap(() => this.snackBarService.openSnackBar('Permission granted successfully')),
        switchMap(() => this.expDataService.getExperimentsForUser(this.userId)),
      )
      .subscribe((experiments) => this.experimentsDataSource = experiments);
  }

  handleExperimentActions(event: TableActionEvent<any>) {
    const actionMapping: { [key: string]: any } = {
      [TableActionEnum.EDIT]: this.handleEditUserPermissionForExperiment.bind(this),
      [TableActionEnum.REVOKE]: this.revokeExperimentPermissionForUser.bind(this),
    }

    const selectedAction = actionMapping[event.action.action];
    if (selectedAction) {
      selectedAction(event.item);
    }
  }

  revokeExperimentPermissionForUser(item: {id: string}) {
    this.permissionDataService.deleteExperimentPermission({experiment_id: item.id, user_name: this.userId})
      .pipe(
        tap(() => this.snackBarService.openSnackBar('Permission revoked successfully')),
        switchMap(() => this.expDataService.getExperimentsForUser(this.userId)),
      )
      .subscribe((experiments) => this.experimentsDataSource = experiments);

  }

  revokeModelPermissionForUser({name}: any) {
    this.permissionDataService.deleteModelPermission({name: name, user_name: this.userId})
      .pipe(
        tap(() => this.snackBarService.openSnackBar('Permission revoked successfully')),
        switchMap(() => this.modelDataService.getModelsForUser(this.userId)),
      )
      .subscribe((models) => this.modelsDataSource = models);
  }

  handleModelActions({ action, item }: TableActionEvent<any>) {
    const actionMapping: { [key: string]: any } = {
      [TableActionEnum.EDIT]: this.handleEditUserPermissionForModel.bind(this),
      [TableActionEnum.REVOKE]: this.revokeModelPermissionForUser.bind(this),
    }

    const selectedAction = actionMapping[action.action];
    if (selectedAction) {
      selectedAction(item);
    }
  }

  handleEditUserPermissionForModel({ name, permissions }: any) {
    this.permissionModalService.openEditPermissionsForModelModal(name, this.userId, permissions)
      .pipe(
        filter(Boolean),
        switchMap(({ permission }) => this.permissionDataService.updateModelPermission({
          name,
          permission: permission,
          user_name: this.userId,
        })),
        tap(() => this.snackBarService.openSnackBar('Permissions updated successfully')),
        switchMap(() => this.modelDataService.getModelsForUser(this.userId)),
      )
      .subscribe((models) => this.modelsDataSource = models);
  }

  handleEditUserPermissionForExperiment({ id, permissions }: any) {
    this.permissionModalService.openEditPermissionsForExperimentModal(id, this.userId, permissions)
      .pipe(
        filter(Boolean),
        switchMap(({ permission }) => this.permissionDataService.updateExperimentPermission({
          experiment_id: id,
          permission: permission,
          user_name: this.userId,
        })),
        tap(() => this.snackBarService.openSnackBar('Permissions updated successfully')),
        switchMap(() => this.expDataService.getExperimentsForUser(this.userId)),
      )
      .subscribe((experiments) => this.experimentsDataSource = experiments);
  }
}
