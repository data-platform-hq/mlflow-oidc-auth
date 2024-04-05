import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { PermissionsComponent } from './components/permissions/permissions.component';
import {
  UserPermissionDetailsComponent,
} from './components/details/user-permission-details/user-permission-details.component';
import {
  ExperimentPermissionDetailsComponent,
} from './components/details/experiment-permission-details/experiment-permission-details.component';
import {
  ModelPermisionDetailsComponent,
} from './components/details/model-permision-details/model-permision-details.component';


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
        component: ExperimentPermissionDetailsComponent,
      },
      {
        path: 'model/:id',
        component: ModelPermisionDetailsComponent,
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
