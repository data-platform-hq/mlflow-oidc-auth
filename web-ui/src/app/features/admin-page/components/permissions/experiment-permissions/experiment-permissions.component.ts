import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../../../shared/services';

@Component({
  selector: 'ml-experiment-permissions',
  templateUrl: './experiment-permissions.component.html',
  styleUrls: ['./experiment-permissions.component.scss']
})
export class ExperimentPermissionsComponent implements OnInit {
  searchValue: string = '';
  columnConfig = [{
    title: 'Experiment Name',
    key: 'experiment'
  }];
  dataSource: { experiment: string, id: string }[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.dataService.getAllExperiments()
      .subscribe(({ experiments }) => {
        this.dataSource = experiments.map((experiment) => ({ experiment, id: experiment }));
      })
  }

  handleExperimentEdit($event: any) {
    const { id } = $event;
    this.router.navigate(['../experiment/' + id], { relativeTo: this.route })
  }
}
