import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PERMISSIONS } from '../../../core/configs/permissions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


export interface PermissionsDialogData {
  entity: string;
  name: string;
  type: 'model' | 'experiment';
  permission: string;
}
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
    this.title = `Edit ${this.data.type} permissions for ${this.data.name}`;
    this.form = this.fb.group({
      name: this.data.name,
      type: this.data.type,
      permission: [this.data.permission, Validators.required],
    })
  }
}
