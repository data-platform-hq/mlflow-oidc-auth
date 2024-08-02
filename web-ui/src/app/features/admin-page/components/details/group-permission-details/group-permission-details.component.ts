import { Component, OnInit } from '@angular/core';

import { TableActionModel } from 'src/app/shared/components/table/table.interface';
import { GroupDataService } from 'src/app/shared/services/data/group-data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ml-group-permission-details',
  templateUrl: './group-permission-details.component.html',
  styleUrls: ['./group-permission-details.component.scss']
})
export class GroupPermissionDetailsComponent implements OnInit {
  groupName = '';
  userDataSource = [];
  userColumnConfig = [];
  actions: TableActionModel[] = [];

  constructor(
    private readonly groupDataService: GroupDataService,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.groupName = this.route.snapshot.paramMap.get('id') ?? '';

    this.groupDataService.getAllExperimentsForGroup(this.groupName).subscribe(console.log)
    this.groupDataService.getAllRegisteredModelsForGroup(this.groupName).subscribe(console.log)
  }

}
