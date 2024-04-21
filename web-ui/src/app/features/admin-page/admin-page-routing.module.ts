import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AdminPageComponent,
  ExperimentPermissionDetailsComponent,
  ModelPermissionDetailsComponent,
  PermissionsComponent,
  UserPermissionDetailsComponent,
} from './components';

const getBreadcrumb = (route: string) => {
  const [entity, id] = route.split('/')
  return `${entity.charAt(0).toUpperCase() + entity.slice(1)} / ${id}`;
};

const routes: Routes = [
  {
    path: '',
    component: AdminPageComponent,
    children: [
      {
        path: 'permissions',
        component: PermissionsComponent,
        data: {
          breadcrumb: {
            skip: true,
          }
        },
      },
      {
        path: 'user/:id',
        component: UserPermissionDetailsComponent,
        data: {
          breadcrumb:  getBreadcrumb,
        },
      },
      {
        path: 'experiment/:id',
        component: ExperimentPermissionDetailsComponent,
        data: {
          breadcrumb: getBreadcrumb,
        },
      },
      {
        path: 'model/:id',
        component: ModelPermissionDetailsComponent,
        data: {
          breadcrumb: getBreadcrumb,
        },
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
