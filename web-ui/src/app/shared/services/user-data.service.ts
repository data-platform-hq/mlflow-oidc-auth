import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CurrentUserModel } from './user-data.interface';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  getCurrentUser() {
    return this.http.get<CurrentUserModel>('/api/2.0/mlflow/users/current');
  }

  getAccessKey() {
    return this.http.get<{ token: string }>('/api/2.0/mlflow/users/access-token', {});
  }
}
