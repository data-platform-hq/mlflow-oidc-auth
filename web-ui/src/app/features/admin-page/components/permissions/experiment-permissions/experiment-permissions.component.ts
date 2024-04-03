import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ml-experiment-permissions',
  templateUrl: './experiment-permissions.component.html',
  styleUrls: ['./experiment-permissions.component.scss']
})
export class ExperimentPermissionsComponent implements OnInit {
  searchValue: string = '';
  columnConfig = [{
    title: 'User',
    key: 'user'
  }];
  dataSource = [
    {
      user: 'experiment',
      id: '1',
    },
    {
      user: 'experiment2',
      id: '2',
    }
  ];
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  handleExperimentEdit($event: any) {
    const { id } = $event;
    this.router.navigate(['../experiment/' + id], { relativeTo: this.route })
  }
}
