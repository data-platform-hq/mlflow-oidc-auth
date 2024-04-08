import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';

import {
  EditPermissionsModalComponent,
  GrantUserPermissionsComponent,
  GrantUserPermissionsModel,
} from 'src/app//shared/components';
import { MatDialog } from '@angular/material/dialog';
import { TableActionEvent, TableActionModel } from 'src/app/shared/components/table/table.interface';
import { ModelsDataService, PermissionDataService, SnackBarService, UserDataService } from 'src/app//shared/services';
import { COLUMN_CONFIG, TABLE_ACTIONS } from './model-permission-details.config';
import { TableActionEnum } from 'src/app/shared/components/table/table.config';
import {
  PermissionsDialogData,
} from 'src/app/shared/components/modals/edit-permissions-modal/edit-permissions-modal.interface';
import { EntityEnum } from 'src/app/core/configs/core';
import { PermissionModalService } from '../../../../../shared/services/permission-modal.service';


@Component({
  selector: 'ml-model-permission-details',
  templateUrl: './model-permission-details.component.html',
  styleUrls: ['./model-permission-details.component.scss'],
})
export class ModelPermissionDetailsComponent implements OnInit {
  modelId!: string;
  userDataSource: any[] = [];

  userColumnConfig = COLUMN_CONFIG;
  actions: TableActionModel[] = TABLE_ACTIONS;

  constructor(
    private readonly dialog: MatDialog,
    private readonly route: ActivatedRoute,
    private readonly modelDataService: ModelsDataService,
    private readonly permissionDataService: PermissionDataService,
    private readonly userDataService: UserDataService,
    private readonly snackService: SnackBarService,
    private readonly permissionModalService: PermissionModalService
  ) {
  }

  ngOnInit(): void {
    this.modelId = this.route.snapshot.paramMap.get('id') ?? '';

    this.loadUsersForModel(this.modelId).subscribe((users) => {
      this.userDataSource = users;
    });
  }

  revokePermissionForUser(item: any) {
    this.permissionDataService.deleteModelPermission(
      { model_name: this.modelId, user_name: item.username }
    )
      .subscribe(console.log);
  }

  editPermissionForUser({ username, permission }: any) {
    this.permissionModalService.openEditUserPermissionsForModelModal(this.modelId, username, permission)
      .pipe(
        tap(() => this.snackService.openSnackBar('Permission updated')),
        switchMap(() => this.loadUsersForModel(this.modelId)),
      )
      .subscribe((users) => {
        this.userDataSource = users;
      });
  }

  handleActions({ action, item }: TableActionEvent<{ model: string; id: string }>) {
    const actionMapping: { [key: string]: any } = {
      [TableActionEnum.REVOKE]: this.revokePermissionForUser.bind(this),
      [TableActionEnum.EDIT]: this.editPermissionForUser.bind(this),
    };

    const selectedAction = actionMapping[action.action];
    if (selectedAction) {
      selectedAction(item);
    }
  }

  loadUsersForModel(modelId: string) {
    return this.modelDataService.getUsersForModel(modelId);
  }

  addUser() {
    this.userDataService.getAllUsers()
      .pipe(
        switchMap(({ users }) => this.dialog.open<GrantUserPermissionsComponent, GrantUserPermissionsModel>(GrantUserPermissionsComponent,
          { data: { users } })
          .afterClosed()),
        filter(Boolean),
        switchMap(({ user, permission }) => this.permissionDataService.createModelPermission({
          model_name: this.modelId,
          new_permission: permission,
          user_name: user,
        })),
        switchMap(() => this.loadUsersForModel(this.modelId)),
      )
      .subscribe((users) => {
        this.userDataSource = users;
      });
  }
}
