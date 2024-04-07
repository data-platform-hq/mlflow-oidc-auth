import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CreateExperimentPermissionRequestBodyModel,
  CreateModelPermissionRequestBodyModel,
} from 'src/app/shared/interfaces/permission-data.interface';
import { API_URL } from 'src/app/core/configs/api-urls';


@Injectable({
  providedIn: 'root',
})
export class PermissionDataService {

  constructor(
    private readonly http: HttpClient,
  ) {
  }

  createExperimentPermission(body: CreateExperimentPermissionRequestBodyModel) {
    return this.http.post(API_URL.CREATE_EXPERIMENT_PERMISSION, body);
  }

  createModelPermission(body: CreateModelPermissionRequestBodyModel) {
    return this.http.post(API_URL.CREATE_EXPERIMENT_PERMISSION, body);
  }

  updateModelPermission(body: { user_name: string, model_name: string, new_permission: string }) {
    return this.http.post(API_URL.UPDATE_MODEL_PERMISSION, body,  {responseType: 'text'});
  }

  updateExperimentPermission(body: { user_name: string, experiment_name: string, new_permission: string }) {
    return this.http.post(API_URL.UPDATE_EXPERIMENT_PERMISSION, body, { responseType: 'text' });
  }

  deleteModelPermission(body: any) {
    return this.http.post(API_URL.DELETE_EXPERIMENT_PERMISSION, body);
  }

}
