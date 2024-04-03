import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ml-user-permissions',
  templateUrl: './user-permissions.component.html',
  styleUrls: ['./user-permissions.component.scss'],
})
export class UserPermissionsComponent implements OnInit {
  searchValue: string = '';
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
  ) {
  }

  ngOnInit(): void {
  }

  handleUserEdit(event: any) {
    const { id } = event;
    this.router.navigate(['../user/' + id], { relativeTo: this.route })
  }
}
