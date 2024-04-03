import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


export interface PermissionsDialogData {
  permissions: string[];
}
@Component({
  selector: 'ml-edit-permissions-modal',
  templateUrl: './edit-permissions-modal.component.html',
  styleUrls: ['./edit-permissions-modal.component.scss']
})
export class EditPermissionsModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<EditPermissionsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PermissionsDialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  ngOnInit(): void {
  }
}
