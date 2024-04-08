import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import {
  EditPermissionsModalComponent,
  GrantUserPermissionsComponent,
  GrantUserPermissionsModel,
} from 'src/app/shared/components';
import { ExperimentsDataService, PermissionDataService, UserDataService } from 'src/app/shared/services';
import { TableActionEvent, TableActionModel } from 'src/app/shared/components/table/table.interface';
import { filter, switchMap } from 'rxjs';
import { TableActionEnum } from 'src/app/shared/components/table/table.config';
import { EntityEnum } from 'src/app/core/configs/core';
import { COLUMN_CONFIG, TABLE_ACTIONS } from './experiment-permission-details.config';
import {
  PermissionsDialogData,
} from 'src/app/shared/components/modals/edit-permissions-modal/edit-permissions-modal.interface';
import { PermissionEnum } from 'src/app/core/configs/permissions';

@Component({
  selector: 'ml-experiment-permission-details',
  templateUrl: './experiment-permission-details.component.html',
  styleUrls: ['./experiment-permission-details.component.scss']
})
export class ExperimentPermissionDetailsComponent implements OnInit {
  experimentId!: string;
  userColumnConfig = COLUMN_CONFIG;
  actions: TableActionModel[] = TABLE_ACTIONS;
  userDataSource: { permission: string, username: string }[] = [];

  constructor(
    private readonly dialog: MatDialog,
    private readonly experimentDataService: ExperimentsDataService,
    private readonly permissionDataService: PermissionDataService,
    private readonly userDataService: UserDataService,
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.experimentId = this.route.snapshot.paramMap.get('id') ?? '';

    this.experimentDataService
      .getUsersForExperiment(this.experimentId)
      .subscribe((users) => {
        this.userDataSource = users;
      });
  }

  handleUserEdit(event: { permission: string; username: string }) {
    const data: PermissionsDialogData = {
      userName: event.username,
      entityName: this.experimentId,
      entityType: EntityEnum.EXPERIMENT,
      permission: event.permission as PermissionEnum,
    };

    this.dialog
      .open<EditPermissionsModalComponent, PermissionsDialogData>(EditPermissionsModalComponent, { data })
      .afterClosed()
      .pipe(
        switchMap((data) => this.permissionDataService.updateExperimentPermission({
          user_name: event.username,
          experiment_id: this.experimentId,
          new_permission: data.permission,
        }))
      )
      .subscribe((data) => {
        console.log(data)
      })
  }

  handleActions($event: TableActionEvent<{ permission: string; username: string }>) {
    const actionMapping: { [key: string]: any } = {
      [TableActionEnum.EDIT]: this.handleUserEdit.bind(this),
      [TableActionEnum.REVOKE]: this.revokePermissionForUser.bind(this),
    }

    const selectedAction = actionMapping[$event.action.action];
    if (selectedAction) {
      selectedAction($event.item);
    }
  }

  revokePermissionForUser(item: any) {
    this.permissionDataService.deleteExperimentPermission(
      { experiment_id: this.experimentId, user_name: item.username })
      .subscribe(console.log);
  }

  addUser() {
    this.userDataService.getAllUsers()
      .pipe(
        switchMap(({ users }) => this.dialog.open<GrantUserPermissionsComponent, GrantUserPermissionsModel>(GrantUserPermissionsComponent,
          { data: { users } })
          .afterClosed()),
        filter(Boolean),
        switchMap(({ user, permission }) => this.permissionDataService.createExperimentPermission({
          experiment_id: this.experimentId,
          new_permission: permission,
          user_name: user,
        })),
        switchMap(() => this.loadUsersForExperiment(this.experimentId)),
      )
      .subscribe((users) => {
        this.userDataSource = users;
      });
  }

  loadUsersForExperiment(experimentId: string) {
    return this.experimentDataService.getUsersForExperiment(experimentId);
  }
}
