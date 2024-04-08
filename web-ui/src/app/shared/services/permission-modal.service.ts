import { Injectable } from '@angular/core';
import { EditPermissionsModalComponent } from '../components';
import { PermissionsDialogData } from '../components/modals/edit-permissions-modal/edit-permissions-modal.interface';
import { filter, switchMap, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EntityEnum } from '../../core/configs/core';
import { PermissionEnum } from '../../core/configs/permissions';
import { PermissionDataService } from './data/permission-data.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionModalService {

  constructor(
    private readonly dialog: MatDialog,
    private readonly permissionDataService: PermissionDataService
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
}
