import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { PermissionsComponent } from './components/permissions/permissions.component';
import {
  UserPermissionDetailsComponent
} from './components/details/user-permission-details/user-permission-details.component';
import {
  ExperimentPermissionsComponent
} from './components/permissions/experiment-permissions/experiment-permissions.component';
import { ModelPermissionsComponent } from './components/permissions/model-permissions/model-permissions.component';


const routes: Routes = [
  {
    path: '',
    component: AdminPageComponent,
    children: [
      {
        path: 'permissions',
        component: PermissionsComponent,
      },
      {
        path: 'user/:id',
        component: UserPermissionDetailsComponent,
      },
      {
        path: 'experiment/:id',
        component: ExperimentPermissionsComponent,
      },
      {
        path: 'model/:id',
        component: ModelPermissionsComponent,
      },
      {
        path: '**',
        redirectTo: 'permissions',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
