import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  AccessKeyDialogData,
  AccessKeyModalComponent,
} from '../../../../shared/components/access-key-modal/access-key-modal.component';

@Component({
  selector: 'ml-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  experimentsColumnConfig = [
    {
      title: 'Experiment name',
      key: 'name',
    },
    {
      title: 'Permissions',
      key: 'permissions',
    },
  ];
  experimentsDataSource = [
    { name: 'experiment1', permissions: 'read' },
    { name: 'experiment2', permissions: 'modify' },
  ];

  modelsColumnConfig = [
    {
      title: 'Model name',
      key: 'name',
    },
    {
      title: 'Permissions',
      key: 'permissions',
    },
  ];
  modelsDataSource = [
    { name: 'model1', permissions: 'read' },
    { name: 'model2', permissions: 'write' },
  ];

  constructor(
    private readonly dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
  }

  showAccessKeyModal() {
    const apiKey = '1234';
    this.dialog.open<AccessKeyModalComponent, AccessKeyDialogData>(AccessKeyModalComponent, {
      data: {
        apiKey,
      },
    });
  }
}
