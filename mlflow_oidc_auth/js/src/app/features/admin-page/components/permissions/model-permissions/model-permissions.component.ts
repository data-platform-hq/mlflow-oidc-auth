import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ml-model-permissions',
  templateUrl: './model-permissions.component.html',
  styleUrls: ['./model-permissions.component.scss']
})
export class ModelPermissionsComponent implements OnInit {
  searchValue: string = '';
  columnConfig = [{
    title: 'User',
    key: 'user'
  }];
  dataSource = [
    {
      user: 'model1',
      id: '1',
    },
    {
      user: 'model2',
      id: '2',
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  handleModelEdit($event: any) {
    const { id } = $event;
    this.router.navigate(['../model/' + id], { relativeTo: this.route })
  }
}
