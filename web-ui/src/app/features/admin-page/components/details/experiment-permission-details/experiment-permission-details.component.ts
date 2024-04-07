import { Component, OnInit } from '@angular/core';
import {
  EditPermissionsModalComponent,
  GrantUserPermissionsComponent,
  GrantUserPermissionsModel,
} from 'src/app/shared/components';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/shared/services';
import { TableActionEvent, TableActionModel } from 'src/app/shared/components/table/table.interface';
import { filter, switchMap } from 'rxjs';
import { TableActionEnum } from 'src/app/shared/components/table/table.config';
import { EntityEnum } from 'src/app/core/configs/core';
import { COLUMN_CONFIG, TABLE_ACTIONS } from './experiment-permission-details.config';
import {
  PermissionsDialogData
} from '../../../../../shared/components/modals/edit-permissions-modal/edit-permissions-modal.interface';
import { PermissionEnum } from '../../../../../core/configs/permissions';

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
      userName: event.username,
      entityName: this.route.snapshot.paramMap.get('id') ?? '',
      entityType: EntityEnum.EXPERIMENT,
      permission: event.permission as PermissionEnum,
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
      [TableActionEnum.EDIT]: this.handleUserEdit.bind(this),
      [TableActionEnum.REVOKE]: this.revokePermissionForUser.bind(this),
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
