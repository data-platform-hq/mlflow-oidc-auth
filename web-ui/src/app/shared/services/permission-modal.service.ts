import { Injectable } from '@angular/core';
import { EditPermissionsModalComponent, GrantPermissionModalComponent } from '../components';
import { PermissionsDialogData } from '../components/modals/edit-permissions-modal/edit-permissions-modal.interface';
import { switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EntityEnum } from '../../core/configs/core';
import { PermissionEnum } from '../../core/configs/permissions';
import { GrantPermissionModalData } from '../components/modals/grant-permissoin-modal/grant-permission-modal.inteface';
import { ModelsDataService } from './data/models-data.service';
import { ExperimentModel } from '../interfaces/experiments-data.interface';

@Injectable({
  providedIn: 'root',
})
export class PermissionModalService {

  constructor(
    private readonly dialog: MatDialog,
    private readonly modelDataService: ModelsDataService,
  ) {
  }

  openEditPermissionsForModelModal(modelName: string, forEntity: string, currentPermission: PermissionEnum) {
    const data: PermissionsDialogData = {
      forEntity,
      entityName: modelName,
      entityType: EntityEnum.MODEL,
      permission: currentPermission,
    };

    return this.dialog
      .open<EditPermissionsModalComponent, PermissionsDialogData>(EditPermissionsModalComponent, { data })
      .afterClosed();
  }

  openEditPermissionsForExperimentModal(experimentName: string, forEntity: string, currentPermission: PermissionEnum) {
    const data: PermissionsDialogData = {
      forEntity,
      entityName: experimentName,
      entityType: EntityEnum.EXPERIMENT,
      permission: currentPermission,
    };

    return this.dialog
      .open<EditPermissionsModalComponent, PermissionsDialogData>(EditPermissionsModalComponent, { data })
      .afterClosed();
  }

  openGrantModelPermissionModal(permissionAssignedTo: string) {
    return this.modelDataService.getAllModels()
      .pipe(
        switchMap((models) => this.dialog.open<GrantPermissionModalComponent, GrantPermissionModalData>(GrantPermissionModalComponent, {
            data: {
              entityType: EntityEnum.MODEL,
              entities: models.map((model, index) => ({ id: index + model.name, name: model.name })),
              permissionAssignedTo,
            },
          }).afterClosed(),
        ),
      )
  }

  openGrantExperimentPermissionModal(experiments: ExperimentModel[], permissionAssignedTo: string) {
    return this.dialog.open<GrantPermissionModalComponent, GrantPermissionModalData>(GrantPermissionModalComponent, {
      data: {
        entityType: EntityEnum.EXPERIMENT,
        entities: experiments,
        permissionAssignedTo,
      },
    }).afterClosed();
  }
}
