import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface GrantPermissionModalData {
  userName: string;
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: GrantPermissionModalData,
    private readonly fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      user: this.data.userName,
      type: this.data.type,
      permission: [null, Validators.required],
      entity: [null, Validators.required],
    })
  }
}
