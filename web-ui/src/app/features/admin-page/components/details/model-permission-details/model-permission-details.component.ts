import { Component, OnInit } from '@angular/core';
import {
  EditPermissionsModalComponent,
  GrantUserPermissionsComponent,
  GrantUserPermissionsModel,
} from 'src/app//shared/components';
import { MatDialog } from '@angular/material/dialog';
import { TableActionEvent, TableActionModel } from 'src/app/shared/components/table/table.interface';
import { DataService } from 'src/app//shared/services';
import { ActivatedRoute } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { COLUMN_CONFIG, TABLE_ACTIONS } from './model-permission-details.config';
import { TableActionEnum } from 'src/app/shared/components/table/table.config';
import {
  PermissionsDialogData
} from '../../../../../shared/components/modals/edit-permissions-modal/edit-permissions-modal.interface';
import { EntityEnum } from '../../../../../core/configs/core';


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
    private readonly dataService: DataService,
    private readonly route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.modelId = this.route.snapshot.paramMap.get('id') ?? '';

    this.loadUsersForModel(this.modelId).subscribe((users) => {
      this.userDataSource = users;
    });
  }

  revokePermissionForUser(item: any) {
    this.dataService.deleteModelPermission(item.id)
      .subscribe(console.log);
  }

  editPermissionForUser({ username, permission }: any) {
    const data: PermissionsDialogData = {
      userName: username,
      entityName: this.modelId,
      entityType: EntityEnum.MODEL,
      permission,
    };

    this.dialog
      .open<EditPermissionsModalComponent, PermissionsDialogData>(EditPermissionsModalComponent, { data })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(({ permission }) => this.dataService.updateModelPermission({
          model_name: this.modelId,
          new_permission: permission,
          user_name: username,
        })),
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
    return this.dataService.getUsersForModel(modelId);
  }

  addUser() {
    this.dataService.getAllUsers()
      .pipe(
        switchMap(({ users }) => this.dialog.open<GrantUserPermissionsComponent, GrantUserPermissionsModel>(GrantUserPermissionsComponent,
          { data: { users } })
          .afterClosed()),
        filter(Boolean),
        switchMap(({ user }) => this.dataService.updateModelPermission({
          model_name: this.modelId,
          new_permission: 'edit',
          user_name: user,
        })),
        switchMap(() => this.loadUsersForModel(this.modelId)),
      )
      .subscribe((users) => {
        this.userDataSource = users;
      });
  }
}