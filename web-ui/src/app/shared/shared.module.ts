import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AccessKeyModalComponent,
  ActionTableComponent,
  EditPermissionsModalComponent,
  GrantPermissionModalComponent,
  HeaderComponent,
  TableComponent,
} from './components';
import { MaterialModule } from './material/material.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TableSearchPipe } from './pipes/table-search.pipe';
import { RouterLinkWithHref } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

const SHARED_COMPONENTS = [
  AccessKeyModalComponent,
  ActionTableComponent,
  EditPermissionsModalComponent,
  GrantPermissionModalComponent,
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
  ],
})
export class SharedModule { }
