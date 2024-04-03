import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminPageRoutingModule } from './admin-page-routing.module';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { SharedModule } from '../../shared/shared.module';
import { UserPermissionsComponent } from './components/permissions/user-permissions/user-permissions.component';
import {
  ExperimentPermissionsComponent,
} from './components/permissions/experiment-permissions/experiment-permissions.component';
import { ModelPermissionsComponent } from './components/permissions/model-permissions/model-permissions.component';
import { FormsModule } from '@angular/forms';
import { UserPermissionDetailsComponent } from './components/details/user-permission-details/user-permission-details.component';
import { PermissionsComponent } from './components/permissions/permissions.component';
import {
  ExperimentPermissionDetailsComponent,
} from './components/details/experiment-permission-details/experiment-permission-details.component';
import { ModelPermisionDetailsComponent } from './components/details/model-permision-details/model-permision-details.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    AdminPageComponent,
    UserPermissionsComponent,
    ExperimentPermissionsComponent,
    ModelPermissionsComponent,
    UserPermissionDetailsComponent,
    PermissionsComponent,
    ExperimentPermissionDetailsComponent,
    ModelPermisionDetailsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminPageRoutingModule,
    FormsModule,
    RouterModule,
  ],
})
export class AdminPageModule {}
