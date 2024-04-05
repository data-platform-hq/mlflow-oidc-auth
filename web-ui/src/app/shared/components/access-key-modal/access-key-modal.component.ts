import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface AccessKeyDialogData {
  token: string;
}

@Component({
  selector: 'ml-access-key-modal',
  templateUrl: './access-key-modal.component.html',
  styleUrls: ['./access-key-modal.component.scss']
})
export class AccessKeyModalComponent implements OnInit {
  token: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AccessKeyDialogData,
  ) { }

  ngOnInit(): void {
    this.token = this.data.token;
  }

  copyInputMessage(userInput: HTMLInputElement) {
    userInput.select();
    document.execCommand('copy');
    userInput.setSelectionRange(0, 0);
  }
}
