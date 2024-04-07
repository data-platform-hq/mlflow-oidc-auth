import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CreateExperimentPermissionRequestBodyModel,
  CreateModelPermissionRequestBodyModel,
  ExperimentModel,
  ExperimentsResponseModel,
  ModelModel,
  ModelsResponseModel,
  UsersForModelModel,
} from '../interfaces/data.interfaces';
import { map } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class DataService {

  constructor(
    private readonly http: HttpClient,
  ) {
  }

  getAllExperiments() {
    return this.http.get<ExperimentModel[]>('/api/2.0/mlflow/experiments');
  }

  getAllModels() {
    return this.http.get<ModelModel[]>('/api/2.0/mlflow/registered-models');
  }

  getAllUsers() {
    return this.http.get<{users: string[]}>('/api/2.0/mlflow/users');
  }

  getExperimentsForUser(userName: string) {
    return this.http.get<ExperimentsResponseModel>(`/api/2.0/mlflow/users/${userName}/experiments`)
      .pipe(
        map(response => response.experiments),
      );
  }

  getModelsForUser(userName: string) {
    return this.http.get<ModelsResponseModel>(`/api/2.0/mlflow/users/${userName}/registered-models`)
      .pipe(
        map(response => response.models),
      );
  }

  createExperimentPermission(body: CreateExperimentPermissionRequestBodyModel) {
    return this.http.post('/api/2.0/mlflow/experiments/permissions/create', body);
  }

  createModelPermission(body: CreateModelPermissionRequestBodyModel) {
    return this.http.post('/api/2.0/mlflow/registered-models/permissions/create', body);
  }

  getUsersForExperiment(experimentName: string) {
    return this.http.get<{
      permission: string,
      username: string
    }[]>(`/api/2.0/mlflow/experiments/${experimentName}/users`);
  }

  getUsersForModel(modelName: string) {
    return this.http.get<UsersForModelModel[]>(`/api/2.0/mlflow/registered-models/${modelName}/users`);
  }

  updateModelPermission(body: { user_name: string, model_name: string, new_permission: string }) {
    return this.http.post('/api/2.0/mlflow/registered-models/permissions/update', body,  {responseType: 'text'});
  }

  deleteModelPermission(body: any) {
    return this.http.post('/api/2.0/mlflow/registered-models/permissions/delete', body);
  }

  updateExperimentPermission(body: { user_name: string, experiment_name: string, new_permission: string }) {
    return this.http.post('/api/2.0/mlflow/experiments/permissions/update', body, { responseType: 'text' });
  }
}
