import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PermissionEnum, PERMISSIONS } from '../../../core/configs/permissions';

export interface GrantPermissionModalData {
  user: string;
  type: 'model' | 'experiment';
  entities: string[];
}

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
    this.title = `Grant ${this.data.type} permissions for ${this.data.user}`;
    this.form = this.fb.group({
      user: this.data.user,
      type: this.data.type,
      permission: [PermissionEnum.READ, Validators.required],
      entity: [null, Validators.required],
    })
  }
}
