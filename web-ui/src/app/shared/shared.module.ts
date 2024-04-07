import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AccessKeyModalComponent,
  ConfirmModalComponent,
  EditPermissionsModalComponent,
  GrantPermissionModalComponent,
  GrantUserPermissionsComponent,
  HeaderComponent,
  TableComponent,
} from './components';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink, RouterLinkWithHref } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

const SHARED_COMPONENTS = [
  AccessKeyModalComponent,
  ConfirmModalComponent,
  EditPermissionsModalComponent,
  GrantPermissionModalComponent,
  GrantUserPermissionsComponent,
  HeaderComponent,
  TableComponent,
];

@NgModule({
  declarations: [
    ...SHARED_COMPONENTS,
  ],
  exports: [
    ...SHARED_COMPONENTS,

    MaterialModule,
  ],
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    NgbModule,
    RouterLinkWithHref,
    HttpClientModule,
    ReactiveFormsModule,
    RouterLink,
  ],
})
export class SharedModule { }
