import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditPermissionsModalComponent } from '../../../../../shared/components';

@Component({
  selector: 'ml-user-permission-details',
  templateUrl: './user-permission-details.component.html',
  styleUrls: ['./user-permission-details.component.scss'],
})
export class UserPermissionDetailsComponent implements OnInit {
  columnConfig = [{
    title: 'User',
    key: 'user',
  }];
  dataSource = [
    {
      user: 'Alex',
      id: '1',
    },
    {
      user: 'Bob',
      id: '2',
    },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
  }

  handleUserEdit(event: any) {
    this.dialog
      .open(EditPermissionsModalComponent)
      .afterClosed()
      .subscribe((data) => {
        console.log(data)
      })
  }
}
