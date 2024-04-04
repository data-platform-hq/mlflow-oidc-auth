import { Component, OnInit } from '@angular/core';
import { EditPermissionsModalComponent } from '../../../../../shared/components';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'ml-experiment-permission-details',
  templateUrl: './experiment-permission-details.component.html',
  styleUrls: ['./experiment-permission-details.component.scss']
})
export class ExperimentPermissionDetailsComponent implements OnInit {
  userColumnConfig = [
    {
      title: 'User name',
      key: 'userName',
    }, {
      title: 'Permissions',
      key: 'permissions',
    },
  ];

  userDataSource = [
    {
      userName: 'Test 0',
      permissions: 'admin',
    },
    {
      userName: 'Test 1',
      permissions: 'admin',
    },
    {
      userName: 'Test 2',
      permissions: 'admin',
    },
  ];

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }
  handleUserEdit($event: any) {
    this.dialog
      .open(EditPermissionsModalComponent)
      .afterClosed()
      .subscribe((data) => {
        console.log(data)
      })
  }
}
