import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../../../shared/services';
import { TableActionEvent, TableActionModel } from '../../../../../shared/components/table/table.interface';

enum UserActionsEnum {
  EDIT = 'EDIT',
}

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
  searchValue: string = '';
  columnConfig = [
    {
      title: 'User',
      key: 'user',
    },
  ];
  dataSource: UserModel[] = [];
  actions: TableActionModel[] = [
    {
      action: UserActionsEnum.EDIT,
      icon: 'edit',
      name: 'Edit',
    },
  ];

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dataService: DataService,
  ) {
  }

  ngOnInit(): void {
    this.dataService.getAllUsers()
      .subscribe(({ users }) => {
        this.dataSource = users.map((user) => ({ user, id: user }));
      })
  }

  handleUserEdit({ id }: UserModel): void {
    this.router.navigate(['../user/' + id], { relativeTo: this.route })
  }

  handleItemAction({ action, item }: TableActionEvent<UserModel>) {
    const actionHandlers: { [key: string]: (user: UserModel) => void } = {
      [UserActionsEnum.EDIT]: this.handleUserEdit.bind(this),
    }

    const selectedAction = actionHandlers[action.action];
    if (selectedAction) {
      selectedAction(item);
    }
  }
}
