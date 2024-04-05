import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccessKeyDialogData, AccessKeyModalComponent } from '../../../../shared/components';
import { AuthService, DataService } from '../../../../shared/services';
import { ExperimentModel, ModelModel, UserResponseModel } from '../../../../shared/interfaces/data.interfaces';

@Component({
  selector: 'ml-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  currentUserInfo: UserResponseModel | null = null;
  loading = false;
  experimentsColumnConfig = [
    { title: 'Experiment Name', key: 'name' },
    { title: 'Permission', key: 'permission' },
  ];
  modelsColumnConfig = [
    { title: 'Model name', key: 'name' },
    { title: 'Permissions', key: 'permission' },
  ];
  experimentsDataSource: ExperimentModel[] = [];
  modelsDataSource: ModelModel[] = [];

  constructor(
    private readonly dialog: MatDialog,
    private readonly dataService: DataService,
    private readonly authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.currentUserInfo = this.authService.getUserInfo();

    if (this.currentUserInfo) {
      const { experiment_permissions, registered_model_permissions } = this.currentUserInfo;

      this.modelsDataSource = registered_model_permissions;
      this.experimentsDataSource = experiment_permissions;
    }
  }

  showAccessKeyModal() {
    this.dataService.getAccessKey()
      .subscribe(({ token }) => {
        const data = { token };
        this.dialog.open<AccessKeyModalComponent, AccessKeyDialogData>(AccessKeyModalComponent, { data })
      });
  }
}
