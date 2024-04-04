import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  AccessKeyDialogData,
  AccessKeyModalComponent,
} from '../../../../shared/components';
import { finalize, forkJoin, switchMap } from 'rxjs';
import { AuthService, DataService } from '../../../../shared/services';

@Component({
  selector: 'ml-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  currentUser?: string;
  loading = false;
  experimentsColumnConfig = [
    {
      title: 'Experiment name',
      key: 'name',
    },
    {
      title: 'Permissions',
      key: 'permissions',
    },
  ];
  experimentsDataSource = [];

  modelsColumnConfig = [
    {
      title: 'Model name',
      key: 'name',
    },
    {
      title: 'Permissions',
      key: 'permissions',
    },
  ];
  modelsDataSource = [];

  constructor(
    private readonly dialog: MatDialog,
    private readonly dataService: DataService,
    private readonly authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();

    if (this.currentUser) {
      this.loading = true;
      forkJoin([
        this.dataService.getExperimentsForUser(this.currentUser),
        this.dataService.getModelsForUser(this.currentUser),
      ])
        .pipe(
          finalize(() => this.loading = false),
        )
        .subscribe(([experiments, models]) => {
          this.experimentsDataSource = experiments;
          this.modelsDataSource = models;
        });
    }
  }

  showAccessKeyModal() {
    this.dataService.getAccessKey()
      .pipe(
        switchMap(({ token }) => this.dialog.open<AccessKeyModalComponent, AccessKeyDialogData>(AccessKeyModalComponent, {
          data: {
            token,
          },
        })
          .afterClosed()),
      )
      .subscribe();
  }
}
