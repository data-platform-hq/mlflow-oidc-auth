import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CreateExperimentPermissionRequestBodyModel,
  CreateModelPermissionRequestBodyModel,
} from 'src/app/shared/interfaces/permission-data.interface';
import { API_URL } from 'src/app/core/configs/api-urls';
import { PermissionEnum } from '../../../core/configs/permissions';


@Injectable({
  providedIn: 'root',
})
export class PermissionDataService {

  constructor(
    private readonly http: HttpClient,
  ) {
  }

  createExperimentPermission(body: CreateExperimentPermissionRequestBodyModel) {
    return this.http.post(API_URL.CREATE_EXPERIMENT_PERMISSION, body, { responseType: 'text' });
  }

  updateExperimentPermission(body: { experiment_id: string, user_name: string, permission: string }) {
    return this.http.patch(API_URL.UPDATE_EXPERIMENT_PERMISSION, body, { responseType: 'text' });
  }

  deleteExperimentPermission(body: { experiment_id: string, user_name: string }) {
    return this.http.delete(API_URL.DELETE_EXPERIMENT_PERMISSION, { body });
  }

  createModelPermission(body: CreateModelPermissionRequestBodyModel) {
    return this.http.post(API_URL.CREATE_MODEL_PERMISSION, body);
  }

  updateModelPermission(body: { user_name: string, name: string, permission: string }) {
    return this.http.patch(API_URL.UPDATE_MODEL_PERMISSION, body, { responseType: 'text' });
  }

  deleteModelPermission(body: { name: string, user_name: string }) {
    return this.http.delete(API_URL.DELETE_MODEL_PERMISSION, { body });
  }

  addExperimentPermissionToGroup(groupName: string, experiment_id: string, permission: PermissionEnum) {
    return this.http.post(
      API_URL.CREATE_GROUP_EXPERIMENT_PERMISSION.replace('${groupName}', groupName),
      {
        experiment_id,
        permission,
      });
  }

  addModelPermissionToGroup(modelName: string, groupName: string, permission: string) {
    return this.http.post(
      API_URL.CREATE_GROUP_MODEL_PERMISSION.replace('${groupName}', groupName),
      {
        model_name: modelName,
        permission,
      });
  }

  removeExperimentPermissionFromGroup(groupName: string, experiment_id: string) {
    return this.http.delete(
      API_URL.DELETE_GROUP_EXPERIMENT_PERMISSION.replace('${groupName}', groupName),
      {
        body: {
          experiment_id
        }
      });
  }

  removeModelPermissionFromGroup(modelName: string, groupName: string) {
    return this.http.delete(
      API_URL.DELETE_GROUP_MODEL_PERMISSION.replace('${groupName}', groupName),
      {
        body: {
          model_name: modelName
        }
      });
  }

  updateExperimentPermissionForGroup(groupName: string, experiment_id: string, permission: string) {
    return this.http.patch(
      API_URL.UPDATE_GROUP_EXPERIMENT_PERMISSION.replace('${groupName}', groupName),
      {
        experiment_id,
        permission
      });
  }

  updateModelPermissionForGroup(modelName: string, groupName: string, permission: string) {
    return this.http.patch(
      API_URL.UPDATE_GROUP_MODEL_PERMISSION.replace('${groupName}', groupName),
      {
        model_name: modelName,
        permission
      });
  }

}
