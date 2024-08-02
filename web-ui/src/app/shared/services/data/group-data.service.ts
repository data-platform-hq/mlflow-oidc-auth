import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/app/core/configs/api-urls';
import { GroupsDataModel } from 'src/app/shared/interfaces/groups-data.interface';

@Injectable({
  providedIn: 'root'
})
export class GroupDataService {

  constructor(
    private readonly http: HttpClient
  ) { }

  getAllGroups() {
    return this.http.get<GroupsDataModel>(API_URL.ALL_GROUPS);
  }

  getAllExperimentsForGroup(groupName: string) {
    return this.http.get<any>(`/api/2.0/mlflow/groups/${groupName}/experiments`)
  }

  getAllRegisteredModelsForGroup(groupName: string) {
    return this.http.get<any>(`/api/2.0/mlflow/groups/${groupName}/registered-models`)
  }
}
