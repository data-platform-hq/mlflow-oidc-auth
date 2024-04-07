import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DataService } from 'src/app/shared/services';
import { TableActionEvent, TableActionModel } from 'src/app/shared/components/table/table.interface';
import { TableActionEnum } from 'src/app/shared/components/table/table.config';
import { USER_ACTIONS, USER_COLUMN_CONFIG } from './user-permissions.config';

interface UserModel {
  user: string,
  id: string
}

@Component({
  selector: 'ml-user-permissions',
  templateUrl: './user-permissions.component.html',
  styleUrls: ['./user-permissions.component.scss'],
})
export class UserPermissionsComponent implements OnInit {
  columnConfig = USER_COLUMN_CONFIG;
  actions: TableActionModel[] = USER_ACTIONS;
  dataSource: UserModel[] = [];

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dataService: DataService,
  ) {
  }

  ngOnInit(): void {
    this.dataService.getAllUsers()
      .subscribe(({ users }) => this.dataSource = users.map((user) => ({ user, id: user })))
  }

  handleItemAction({ action, item }: TableActionEvent<UserModel>) {
    const actionHandlers: { [key: string]: (user: UserModel) => void } = {
      [TableActionEnum.EDIT]: this.handleUserEdit.bind(this),
    }

    const selectedAction = actionHandlers[action.action];
    if (selectedAction) {
      selectedAction(item);
    }
  }

  handleUserEdit({ id }: UserModel): void {
    this.router.navigate(['../user/' + id], { relativeTo: this.route })
  }
}
