import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SignUpRequest } from '../types/sign-up-request';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  signUp(data: SignUpRequest) {
    return this.http.post('/api/1.0/users', data);
  }

  isEmailTaken(value: string) {
    return this.http.post('/api/1.0/user/email', { email: value });
  }

  activate(token: string) {
    return this.http.post('/api/1.0/users/activate/token/' + token, {});
  }

  getUsers() {
    return this.http.get('/api/1.0/users');
  }
}
