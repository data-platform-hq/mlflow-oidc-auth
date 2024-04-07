import { Injectable } from '@angular/core';
import { CurrentUserModel } from './user-data.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user!: CurrentUserModel;

  constructor() {
  }

  getUserInfo(): CurrentUserModel {
    return this.user;
  }

  setUserInfo(user: CurrentUserModel) {
    this.user = user;
  }
}
