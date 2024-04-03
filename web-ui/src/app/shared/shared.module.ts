import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionTableComponent, HeaderComponent, TableComponent } from './components';
import { MaterialModule } from './material/material.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TableSearchPipe } from './pipes/table-search.pipe';
import { EditPermissionsModalComponent } from './components/edit-permissions-modal/edit-permissions-modal.component';
import { GrantPermissinModalComponent } from './components/grant-permissin-modal/grant-permissin-modal.component';
import { AccessKeyModalComponent } from './components/access-key-modal/access-key-modal.component';

const SHARED_COMPONENTS = [
  TableComponent,
  HeaderComponent,
  ActionTableComponent,
  TableSearchPipe,
  HeaderComponent,
  EditPermissionsModalComponent,
];

const SHARED_PIPES = [
  TableSearchPipe
];

@NgModule({
  declarations: [
    ...SHARED_COMPONENTS,
    ...SHARED_PIPES,
    GrantPermissinModalComponent,
    AccessKeyModalComponent,
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
  ],
})
export class SharedModule { }
