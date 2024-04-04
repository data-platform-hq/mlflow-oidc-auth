import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../../../shared/services';

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
  dataSource: { user: string, id: string }[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
  ) {
  }

  ngOnInit(): void {
    this.dataService.getAllUsers()
      .subscribe(({ users }) => {
        this.dataSource = users.map((user) => ({ user, id: user }));
      })
  }

  handleUserEdit(event: any) {
    const { id } = event;
    this.router.navigate(['../user/' + id], { relativeTo: this.route })
  }
}
