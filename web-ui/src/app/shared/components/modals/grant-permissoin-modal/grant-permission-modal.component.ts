import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PermissionEnum, PERMISSIONS } from 'src/app/core/configs/permissions';
import { GrantPermissionModalData } from './grant-permission-modal.inteface';

@Component({
  selector: 'ml-grant-permission-modal',
  templateUrl: './grant-permission-modal.component.html',
  styleUrls: ['./grant-permission-modal.component.scss']
})
export class GrantPermissionModalComponent implements OnInit {
  form!: FormGroup;

  permissions = PERMISSIONS;
  title: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: GrantPermissionModalData,
    private readonly fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.title = `Grant ${this.data.entityType} permissions for ${this.data.permissionAssignedTo}`;
    this.form = this.fb.group({
      permission: [PermissionEnum.READ, Validators.required],
      entity: [null, Validators.required],
    })
  }
}
