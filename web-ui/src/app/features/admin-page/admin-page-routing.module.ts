import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AdminPageComponent,
  ExperimentPermissionDetailsComponent,
  GroupPermissionDetailsComponent,
  ModelPermissionDetailsComponent,
  PermissionsComponent,
  UserPermissionDetailsComponent,
} from './components';
import { AdminPageRoutesEnum } from './config';

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
        path: AdminPageRoutesEnum.PERMISSIONS,
        component: PermissionsComponent,
        data: {
          breadcrumb: {
            skip: true,
          }
        },
      },
      {
        path: `${AdminPageRoutesEnum.USER}/:id`,
        component: UserPermissionDetailsComponent,
        data: {
          breadcrumb:  getBreadcrumb,
        },
      },
      {
        path: `${AdminPageRoutesEnum.EXPERIMENT}/:id`,
        component: ExperimentPermissionDetailsComponent,
        data: {
          breadcrumb: getBreadcrumb,
        },
      },
      {
        path: `${AdminPageRoutesEnum.MODEL}/:id`,
        component: ModelPermissionDetailsComponent,
        data: {
          breadcrumb: getBreadcrumb,
        },
      },
      {
        path: `${AdminPageRoutesEnum.GROUP}/:id`,
        component: GroupPermissionDetailsComponent,
        data: {
          breadcrumb: getBreadcrumb,
        },
      },
      {
        path: '**',
        redirectTo: AdminPageRoutesEnum.PERMISSIONS,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
