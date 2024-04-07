import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PERMISSIONS } from 'src/app/core/configs/permissions';
import { PermissionsDialogData } from './edit-permissions-modal.interface';

@Component({
  selector: 'ml-edit-permissions-modal',
  templateUrl: './edit-permissions-modal.component.html',
  styleUrls: ['./edit-permissions-modal.component.scss']
})
export class EditPermissionsModalComponent implements OnInit {
  permissions = PERMISSIONS;
  title: string = '';

  form!: FormGroup

  constructor(
    public dialogRef: MatDialogRef<EditPermissionsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PermissionsDialogData,
    private readonly fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.title = `Edit ${this.data.entityName} permissions for ${this.data.userName}`;
    this.form = this.fb.group({
      permission: [this.data.permission, Validators.required],
    })
  }
}
