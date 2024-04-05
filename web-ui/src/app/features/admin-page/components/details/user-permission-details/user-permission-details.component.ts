import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GrantPermissionModalComponent, GrantPermissionModalData } from '../../../../../shared/components';
import { DataService } from '../../../../../shared/services';
import { filter, forkJoin, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ml-user-permission-details',
  templateUrl: './user-permission-details.component.html',
  styleUrls: ['./user-permission-details.component.scss'],
})
export class UserPermissionDetailsComponent implements OnInit {
  userId: string = '';
  experimentsColumnConfig = [
    { title: 'Experiment Name', key: 'name' },
    { title: 'Permission', key: 'permissions' },
  ];
  modelsColumnConfig = [
    { title: 'Model name', key: 'name' },
    { title: 'Permissions', key: 'permissions' },
  ];

  experimentsDataSource: any[] = [];
  modelsDataSource: any[] = [];

  constructor(
    private readonly dialog: MatDialog,
    private readonly dataService: DataService,
    private readonly route: ActivatedRoute,
    private readonly cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') ?? '';

    forkJoin([
      this.dataService.getExperimentsForUser(this.userId),
      this.dataService.getModelsForUser(this.userId),
    ])
      .subscribe(([experiments, models]) => {
        this.experimentsDataSource = experiments;
        this.modelsDataSource = models;
        this.cd.detectChanges();
      });

  }

  addModelPermissionToUser() {
    this.dataService.getAllModels()
      .pipe(
        switchMap((models) => this.dialog.open<GrantPermissionModalComponent, GrantPermissionModalData>(GrantPermissionModalComponent, {
          data: {
            type: 'model',
            entities: models.map(({ name }) => name),
            user: this.userId,
          }
          }).afterClosed()
        ),
        filter(Boolean),
        switchMap(({ entity, permission, user }) => this.dataService.createModelPermission({
          user_name: user,
          model_name: entity,
          new_permission: permission,
        })),
      )
      .subscribe();
  }

  addExperimentPermissionToUser() {
    this.dataService.getAllExperiments()
      .pipe(
        switchMap((experiments) => this.dialog.open<GrantPermissionModalComponent, GrantPermissionModalData>(GrantPermissionModalComponent, {
          data: {
            type: 'experiment',
            entities: experiments.map(({ name }) => name),
            user: this.userId,
          }
          }).afterClosed()
        ),
        filter(Boolean),
        switchMap(({ entity, permission, user }) => this.dataService.createExperimentPermission({
          user_name: user,
          experiment_name: entity,
          new_permission: permission,
        })),
      )
      .subscribe();
  }
}
