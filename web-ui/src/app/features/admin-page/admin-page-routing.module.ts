import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AdminPageComponent,
  ExperimentPermissionDetailsComponent,
  ModelPermissionDetailsComponent,
  PermissionsComponent,
  UserPermissionDetailsComponent,
} from './components';


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
        component: ModelPermissionDetailsComponent,
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
