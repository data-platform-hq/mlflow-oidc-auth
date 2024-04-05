import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditPermissionsModalComponent, GrantPermissionModalComponent } from '../../../../../shared/components';

@Component({
  selector: 'ml-user-permission-details',
  templateUrl: './user-permission-details.component.html',
  styleUrls: ['./user-permission-details.component.scss'],
})
export class UserPermissionDetailsComponent implements OnInit {
  modelColumnConfig = [
    {
      title: 'Modal name',
      key: 'modal',
    }, {
      title: 'Permissions',
      key: 'permissions',
    },
  ];
  modelDataSource = [
    {
      modal: 'Model 1',
      permissions: 'Read',
    },
    {
      modal: 'Model 2',
      permissions: 'Write',
    },
    {
      modal: 'Model 3',
      permissions: 'Read',
    },
  ];

  experimentColumnConfig = [
    {
      title: 'Experiment name',
      key: 'experiment',
    }, {
      title: 'Permissions',
      key: 'permissions',
    },
  ];
  experimentDataSource = [
    {
      experiment: 'Experiment 1',
      permissions: 'Read',
    },
    {
      experiment: 'Experiment 2',
      permissions: 'Write',
    },
  ]


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
  }


  handleUserEditForModel($event: any) {
    this.dialog
      .open(EditPermissionsModalComponent)
      .afterClosed()
      .subscribe((data) => {
        console.log(data)
      })
  }

  handleUserEditForExperiment($event: any) {
    this.dialog
      .open(EditPermissionsModalComponent)
      .afterClosed()
      .subscribe((data) => {
        console.log(data)
      })
  }

  add() {
    this.dialog.open(GrantPermissionModalComponent)
      .afterClosed()
      .subscribe(console.log);
  }
}
