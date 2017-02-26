import { Injectable } from '@angular/core';

import { LocalStorageService } from "angular-2-local-storage";

@Injectable()
export class TokenService {

  constructor(private localStorageService: LocalStorageService) {
  }

  getToken(): string {
    return localStorage.getItem('token');
  }


  setToken(authToken: string, expireDate?: Date): void {
    localStorage.setItem('token', authToken);

  }

  clearToken(): void {
    localStorage.removeItem('token');
  }

}
