import { Injectable } from '@angular/core';
import { UserResponseModel } from '../interfaces/data.interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user: UserResponseModel | null = null;

  constructor() {
  }

  getUserInfo(): UserResponseModel | null {
    return this.user ? this.user : null;
  }

  setUserInfo(user: UserResponseModel) {
    this.user = user;
  }
}
