import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  EditPermissionsModalComponent,
  GrantPermissionModalComponent,
  GrantPermissionModalData,
} from '../../../../../shared/components';
import { DataService } from '../../../../../shared/services';
import { filter, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ml-user-permission-details',
  templateUrl: './user-permission-details.component.html',
  styleUrls: ['./user-permission-details.component.scss'],
})
export class UserPermissionDetailsComponent implements OnInit {
  userId: string | null = null;
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
    private readonly dialog: MatDialog,
    private readonly dataService: DataService,
    private readonly route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
  }


  handleUserEditForModel() {
    this.dialog
      .open(EditPermissionsModalComponent)
      .afterClosed()
      .subscribe((data) => {
        console.log(data)
      })
  }

  handleUserEditForExperiment() {
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

  addModelPermissionToUser() {
    this.dataService.getAllModels()
      .pipe(
        switchMap(({ models }) => this.dialog.open<GrantPermissionModalComponent, GrantPermissionModalData>(GrantPermissionModalComponent, {
          data: {
            type: 'model',
            entities: models,
            userName: this.userId ? this.userId : '',
          }
        })
          .afterClosed()),
        filter(Boolean),
      )
      .subscribe((data) => {
        const { entity, permission, user } = data;
        this.dataService.createModelPermission({
          user_name: user,
          model_name: entity,
          new_permission: permission,
        }).subscribe();
      });
  }

  addExperimentPermissionToUser() {
    this.dataService.getAllExperiments()
      .pipe(
        switchMap(({ experiments }) => this.dialog.open<GrantPermissionModalComponent, GrantPermissionModalData>(GrantPermissionModalComponent, {
          data: {
            type: 'experiment',
            entities: experiments,
            userName: this.userId ? this.userId : '',
          }
        })
          .afterClosed()),
        filter(Boolean),
      )
      .subscribe((data) => {
        const { entity, permission, user } = data;
        this.dataService.createExperimentPermission({
          user_name: user,
          experiment_name: entity,
          new_permission: permission,
        }).subscribe();
      });
  }
}
