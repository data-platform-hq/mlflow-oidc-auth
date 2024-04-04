import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserPermissionDetailsComponent } from '../details/user-permission-details/user-permission-details.component';
import { ExperimentPermissionsComponent } from './experiment-permissions/experiment-permissions.component';
import { ModelPermissionsComponent } from './model-permissions/model-permissions.component';
import { DataService } from '../../../../shared/services';

@Component({
  selector: 'ml-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }

  handleTabSelection($event: MatTabChangeEvent) {
      const mapping: { [key: number]: string } = {
        0: 'user',
        1: 'experiment',
        2: 'model',
      }
      const route = mapping[$event.index];
      if (route) {
        setTimeout(() =>  void this.router.navigate([route], { relativeTo: this.route }))
      }
  }
}
