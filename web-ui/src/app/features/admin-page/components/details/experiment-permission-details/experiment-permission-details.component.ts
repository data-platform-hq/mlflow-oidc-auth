import { Component, OnInit } from '@angular/core';
import {
  EditPermissionsModalComponent,
  GrantUserPermissionsComponent, GrantUserPermissionsModel,
  PermissionsDialogData,
} from '../../../../../shared/components';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../../../shared/services';
import { TableActionEvent, TableActionModel } from '../../../../../shared/components/table/table.interface';
import { filter, switchMap } from 'rxjs';

enum TableActionsEnum {
  EDIT = 'EDIT',
  REVOKE = 'REVOKE',
}

@Component({
  selector: 'ml-experiment-permission-details',
  templateUrl: './experiment-permission-details.component.html',
  styleUrls: ['./experiment-permission-details.component.scss']
})
export class ExperimentPermissionDetailsComponent implements OnInit {
  experimentId!: string;
  userColumnConfig = [
    {
      title: 'User name',
      key: 'username',
    }, {
      title: 'Permissions',
      key: 'permission',
    },
  ];
  actions: TableActionModel[] = [
    { action: TableActionsEnum.EDIT, icon: 'edit', name: 'Edit' },
    { action: TableActionsEnum.REVOKE, icon: 'key_off', name: 'Revoke' },
  ];
  userDataSource: { permission: string, username: string }[] = [];

  constructor(
    private readonly dialog: MatDialog,
    private readonly dataService: DataService,
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.experimentId = this.route.snapshot.paramMap.get('id') ?? '';

    this.dataService
      .getUsersForExperiment(this.experimentId)
      .subscribe((users) => {
        this.userDataSource = users;
      });
  }

  handleUserEdit(event: { permission: string; username: string }) {
    const data: PermissionsDialogData = {
      name: event.username,
      entity: this.route.snapshot.paramMap.get('id') ?? '',
      type: 'experiment',
      permission: event.permission,
    };

    this.dialog
      .open<EditPermissionsModalComponent, PermissionsDialogData>(EditPermissionsModalComponent, { data })
      .afterClosed()
      .pipe(
        switchMap((data) => this.dataService.updateExperimentPermission({
          user_name: data.name,
          experiment_name: this.route.snapshot.paramMap.get('id') ?? '',
          new_permission: data.permission,
        }) )
      )
      .subscribe((data) => {
        console.log(data)
      })
  }

  handleActions($event: TableActionEvent<{ permission: string; username: string }>) {
    const actionMapping: { [key: string]: any } = {
      [TableActionsEnum.EDIT]: this.handleUserEdit.bind(this),
      [TableActionsEnum.REVOKE]: this.revokePermissionForUser.bind(this),
    }

    const selectedAction = actionMapping[$event.action.action];
    if (selectedAction) {
      selectedAction($event.item);
    }
  }

  revokePermissionForUser(item: any) {
    this.dataService.updateExperimentPermission(item.username)
      .subscribe(console.log);
  }

  addUser() {
    this.dataService.getAllUsers()
      .pipe(
        switchMap(({ users }) => this.dialog.open<GrantUserPermissionsComponent, GrantUserPermissionsModel>(GrantUserPermissionsComponent,
          { data: { users } })
          .afterClosed()),
        filter(Boolean),
        switchMap(({ user }) => this.dataService.updateModelPermission({
          model_name: this.experimentId,
          new_permission: 'edit',
          user_name: user,
        })),
        switchMap(() => this.loadUsersForExperiment(this.experimentId)),
      )
      .subscribe((users) => {
        this.userDataSource = users;
      });
  }

  loadUsersForExperiment(experimentId: string) {
    return this.dataService.getUsersForExperiment(experimentId);
  }
}
