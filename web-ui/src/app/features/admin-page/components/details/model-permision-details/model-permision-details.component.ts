import { Component, OnInit } from '@angular/core';
import {
  EditPermissionsModalComponent,
  GrantUserPermissionsComponent,
  GrantUserPermissionsModel,
  PermissionsDialogData,
} from '../../../../../shared/components';
import { MatDialog } from '@angular/material/dialog';
import { TableActionEvent, TableActionModel } from '../../../../../shared/components/table/table.interface';
import { DataService } from '../../../../../shared/services';
import { ActivatedRoute } from '@angular/router';
import { filter, switchMap } from 'rxjs';

enum ModelActionsEnum {
  REVOKE = 'REVOKE',
  EDIT = 'EDIT',
}

@Component({
  selector: 'ml-model-permision-details',
  templateUrl: './model-permision-details.component.html',
  styleUrls: ['./model-permision-details.component.scss'],
})
export class ModelPermisionDetailsComponent implements OnInit {
  modelId!: string;
  userColumnConfig = [
    {
      title: 'User name',
      key: 'username',
    },
    {
      title: 'Permissions',
      key: 'permission',
    },
  ];

  userDataSource: any[] = [];

  actions: TableActionModel[] = [
    { action: ModelActionsEnum.REVOKE, icon: 'key_off', name: 'Revoke' },
    { action: ModelActionsEnum.EDIT, icon: 'edit', name: 'Edit' },
  ];

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
    console.log(item, 'revokePermissionForUser')
    this.dataService.deleteModelPermission(item.id)
      .subscribe(console.log);
  }

  editPermissionForUser({ username, permission }: any) {
    const data: PermissionsDialogData = {
      name: username,
      entity: this.modelId,
      type: 'model',
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
      [ModelActionsEnum.REVOKE]: this.revokePermissionForUser.bind(this),
      [ModelActionsEnum.EDIT]: this.editPermissionForUser.bind(this),
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
