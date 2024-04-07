import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GrantPermissionModalComponent } from 'src/app/shared/components';
import { DataService } from 'src/app/shared/services';
import { filter, forkJoin, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
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
            entityType: EntityEnum.MODEL,
            entities: models.map(({ name }) => name),
            userName: this.userId,
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
            entityType: EntityEnum.EXPERIMENT,
            entities: experiments.map(({ name }) => name),
            userName: this.userId,
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
