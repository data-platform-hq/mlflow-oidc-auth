import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, forkJoin, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { GrantPermissionModalComponent } from 'src/app/shared/components';
import { ExperimentsDataService, ModelsDataService, PermissionDataService } from 'src/app/shared/services';
import { EXPERIMENT_COLUMN_CONFIG, MODEL_COLUMN_CONFIG } from './user-permission-details.config';
import { EntityEnum } from 'src/app/core/configs/core';
import {
  GrantPermissionModalData,
} from 'src/app/shared/components/modals/grant-permissoin-modal/grant-permission-modal.inteface';

@Component({
  selector: 'ml-user-permission-details',
  templateUrl: './user-permission-details.component.html',
  styleUrls: ['./user-permission-details.component.scss'],
})
export class UserPermissionDetailsComponent implements OnInit {
  userId: string = '';
  experimentsColumnConfig = EXPERIMENT_COLUMN_CONFIG;
  modelsColumnConfig = MODEL_COLUMN_CONFIG;

  experimentsDataSource: any[] = [];
  modelsDataSource: any[] = [];

  constructor(
    private readonly dialog: MatDialog,
    private readonly expDataService: ExperimentsDataService,
    private readonly modelDataService: ModelsDataService,
    private readonly permissionDataService: PermissionDataService,
    private readonly route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') ?? '';

    forkJoin([
      this.expDataService.getExperimentsForUser(this.userId),
      this.modelDataService.getModelsForUser(this.userId),
    ])
      .subscribe(([experiments, models]) => {
        this.experimentsDataSource = experiments;
        this.modelsDataSource = models;
      });

  }

  addModelPermissionToUser() {
    this.modelDataService.getAllModels()
      .pipe(
        switchMap((models) => this.dialog.open<GrantPermissionModalComponent, GrantPermissionModalData>(GrantPermissionModalComponent, {
          data: {
            entityType: EntityEnum.MODEL,
            entities: models.map(({ name }) => name),
            userName: this.userId,
          }
          }).afterClosed()
        ),
        filter(Boolean),
        switchMap(({ entity, permission, user }) => this.permissionDataService.createModelPermission({
          user_name: this.userId,
          model_name: entity,
          new_permission: permission,
        })),
      )
      .subscribe();
  }

  addExperimentPermissionToUser() {
    this.expDataService.getAllExperiments()
      .pipe(
        switchMap((experiments) => this.dialog.open<GrantPermissionModalComponent, GrantPermissionModalData>(GrantPermissionModalComponent, {
          data: {
            entityType: EntityEnum.EXPERIMENT,
            entities: experiments.map(({ name }) => name),
            userName: this.userId,
          }
          }).afterClosed()
        ),
        filter(Boolean),
        switchMap(({ entity, permission, user }) => {
          debugger
          return this.permissionDataService.createExperimentPermission({
            user_name: this.userId,
            experiment_name: entity,
            new_permission: permission,
          })
        }),
      )
      .subscribe();
  }
}
