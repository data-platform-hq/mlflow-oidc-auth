import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user?: string;

  constructor() {
  }

  getUser() {
    return this.user;
  }

  setUser(user: string) {
    this.user = user;
  }
}
