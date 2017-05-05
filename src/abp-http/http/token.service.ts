import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable()
export class TokenService {

  constructor(private localStorageService: LocalStorageService) {
  }

  getToken(): string {
    return this.localStorageService.retrieve('token');
  }


  setToken(authToken: string, expireDate?: Date): void {
    this.localStorageService.store('token', authToken);
  }

  clearToken(): void {
    this.localStorageService.clear('token');
  }

}
