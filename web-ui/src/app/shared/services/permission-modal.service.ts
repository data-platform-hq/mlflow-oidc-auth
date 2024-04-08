import { Injectable } from '@angular/core';
import { EditPermissionsModalComponent, GrantPermissionModalComponent } from '../components';
import { PermissionsDialogData } from '../components/modals/edit-permissions-modal/edit-permissions-modal.interface';
import { filter, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EntityEnum } from '../../core/configs/core';
import { PermissionEnum } from '../../core/configs/permissions';
import { PermissionDataService } from './data/permission-data.service';
import { GrantPermissionModalData } from '../components/modals/grant-permissoin-modal/grant-permission-modal.inteface';
import { ModelsDataService } from './data/models-data.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionModalService {

  constructor(
    private readonly dialog: MatDialog,
    private readonly permissionDataService: PermissionDataService,
    private readonly modelDataService: ModelsDataService,
  ) {
  }

  openEditUserPermissionsForModelModal(modelName: string, userName: string, currentPermission: PermissionEnum) {
    const data: PermissionsDialogData = {
      userName: userName,
      entityName: modelName,
      entityType: EntityEnum.MODEL,
      permission: currentPermission,
    };

    return this.dialog
      .open<EditPermissionsModalComponent, PermissionsDialogData>(EditPermissionsModalComponent, { data })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(({ permission }) => this.permissionDataService.updateModelPermission({
          model_name: modelName,
          new_permission: permission,
          user_name: userName,
        })),
      )
  }

  openEditUserPermissionsForExperimentModal(experimentName: string, userName: string, currentPermission: PermissionEnum) {
    const data: PermissionsDialogData = {
      userName: userName,
      entityName: experimentName,
      entityType: EntityEnum.EXPERIMENT,
      permission: currentPermission,
    };

    return this.dialog
      .open<EditPermissionsModalComponent, PermissionsDialogData>(EditPermissionsModalComponent, { data })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(({ permission }) => this.permissionDataService.updateExperimentPermission({
          experiment_id: experimentName,
          new_permission: permission,
          user_name: userName,
        })),
      )
  }

  openGrantModelPermissionModal(userName: string) {
    return this.modelDataService.getAllModels()
      .pipe(
        switchMap((models) => this.dialog.open<GrantPermissionModalComponent, GrantPermissionModalData>(GrantPermissionModalComponent, {
            data: {
              entityType: EntityEnum.MODEL,
              entities: models.map(({ name }) => name),
              userName,
            },
          }).afterClosed(),
        ),
      )
  }
}
