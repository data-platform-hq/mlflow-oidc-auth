import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { TableActionEvent, TableActionModel } from 'src/app/shared/components/table/table.interface';
import { TableActionEnum } from 'src/app/shared/components/table/table.config';
import { GROUP_ACTIONS, GROUP_COLUMN_CONFIG } from './group-permissions.config';
import { GroupDataService } from 'src/app/shared/services/data/group-data.service';

@Component({
  selector: 'ml-group-permissions',
  templateUrl: './group-permissions.component.html',
  styleUrls: ['./group-permissions.component.scss']
})
export class GroupPermissionsComponent implements OnInit {

  columnConfig = GROUP_COLUMN_CONFIG;
  dataSource: {group: any}[] = [];
  actions: TableActionModel[] = GROUP_ACTIONS;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly groupDataService: GroupDataService,
  ) { }

  ngOnInit(): void {
    this.groupDataService.getAllGroups()
      .pipe(
        map(({groups}) => groups.map((group) => ({group}))),
      )
      .subscribe((groups) => this.dataSource = groups);
  }

  handleItemAction({ action, item }: TableActionEvent<any>) {
    const actionHandlers: { [key: string]: (group: any) => void } = {
      [TableActionEnum.EDIT]: this.handleUserEdit.bind(this),
    }

    const selectedAction = actionHandlers[action.action];
    if (selectedAction) {
      selectedAction(item);
    }
  }

  handleUserEdit({ group }: any): void {
    this.router.navigate(['../group/' + group], { relativeTo: this.route })
  }
}
