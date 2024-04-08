import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AllUsersListModel, CurrentUserModel, TokenModel } from '../../interfaces/user-data.interface';
import { API_URL } from 'src/app/core/configs/api-urls';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  getCurrentUser() {
    return this.http.get<CurrentUserModel>(API_URL.GET_CURRENT_USER);
  }

  getAccessKey() {
    return this.http.get<TokenModel>(API_URL.GET_ACCESS_TOKEN);
  }

  getAllUsers() {
    return this.http.get<AllUsersListModel>(API_URL.GET_ALL_USERS);
  }
}
