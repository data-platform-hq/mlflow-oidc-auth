import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AccessKeyModalComponent,
  ActionTableComponent,
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
import { TableSearchPipe } from './pipes/table-search.pipe';
import { RouterLink, RouterLinkWithHref } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

const SHARED_COMPONENTS = [
  AccessKeyModalComponent,
  ActionTableComponent,
  ConfirmModalComponent,
  EditPermissionsModalComponent,
  GrantPermissionModalComponent,
  GrantUserPermissionsComponent,
  HeaderComponent,
  TableComponent,
];

const SHARED_PIPES = [
  TableSearchPipe
];

@NgModule({
  declarations: [
    ...SHARED_COMPONENTS,
    ...SHARED_PIPES,
  ],
  exports: [
    ...SHARED_COMPONENTS,
    ...SHARED_PIPES,

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
