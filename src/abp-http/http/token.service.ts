import { Injectable } from '@angular/core';

import { LocalStorageService } from 'angular-2-local-storage';

@Injectable()
export class TokenService {

  constructor(private localStorageService: LocalStorageService) {
  }

  getToken(): string {
    return this.localStorageService.get<string>('token');
  }


  setToken(authToken: string, expireDate?: Date): void {
    this.localStorageService.set('token', authToken);
  }

  clearToken(): void {
    this.localStorageService.remove('token');
  }

}
