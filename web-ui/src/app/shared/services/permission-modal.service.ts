import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { EntityEnum } from 'src/app/core/configs/core';
import { PermissionEnum } from 'src/app/core/configs/permissions';
import { EditPermissionsModalComponent, GrantPermissionModalComponent } from '../components';
import {
  PermissionDialogResultModel,
  PermissionsDialogData,
} from '../components/modals/edit-permissions-modal/edit-permissions-modal.interface';
import {
  GrantPermissionModalData,
  GrantPermissionModalResult,
  WithNameAndId,
} from '../components/modals/grant-permissoin-modal/grant-permission-modal.inteface';
import { ModelsDataService } from './data/models-data.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionModalService {

  constructor(
    private readonly dialog: MatDialog,
    private readonly modelDataService: ModelsDataService,
  ) {
  }

  openEditPermissionsModal(entity: string, targetEntity: string, currentPermission: PermissionEnum) {
    const dialogData: PermissionsDialogData = {
      targetEntity,
      entity,
      currentPermission,
    };

    return this.dialog.open<EditPermissionsModalComponent, PermissionsDialogData, PermissionDialogResultModel>(
      EditPermissionsModalComponent,
      { data: dialogData },
    ).afterClosed();
  }

  openGrantPermissionModal(entityType = EntityEnum.EXPERIMENT, entities: WithNameAndId[], targetName: string) {
    return this.dialog.open<GrantPermissionModalComponent, GrantPermissionModalData, GrantPermissionModalResult>(
      GrantPermissionModalComponent,
      {
        data: {
          entityType,
          entities,
          targetName,
        },
      }).afterClosed();
  }


  openGrantModelPermissionModal(targetName: string) {
    return this.modelDataService.getAllModels()
      .pipe(
        map((models) => models.map((model, index) => ({ ...model, id: `${index}-${model.name}` }))),
        switchMap(models => this.openGrantPermissionModal(EntityEnum.MODEL, models, targetName)),
      )
  }
}
