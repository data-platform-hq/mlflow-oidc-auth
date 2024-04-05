import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../../../shared/services';

@Component({
  selector: 'ml-model-permissions',
  templateUrl: './model-permissions.component.html',
  styleUrls: ['./model-permissions.component.scss'],
})
export class ModelPermissionsComponent implements OnInit {
  searchValue: string = '';
  columnConfig = [{
    title: 'Model name',
    key: 'model',
  }];
  dataSource: { model: string, id: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
  ) {
  }

  ngOnInit(): void {
    this.dataService.getAllModels()
      .subscribe(({ models }) => {
        this.dataSource = models.map((model) => ({ model, id: model }));
      })
  }

  handleModelEdit($event: any) {
    const { id } = $event;
    this.router.navigate(['../model/' + id], { relativeTo: this.route })
  }
}
