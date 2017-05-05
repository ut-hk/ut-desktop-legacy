import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { TokenService } from '../abp-http/http/token.service';

@Injectable()
export class UserService {

  constructor(private localStorageService: LocalStorageService,
              private tokenService: TokenService) {
  }

  public checkIsMyUser(userId: number): boolean {
    const myUser = this.localStorageService.retrieve('myUser');

    if (myUser == null) {
      return false;
    }

    return myUser.id == userId;
  }

  public clearUserStorage() {
    this.tokenService.clearToken();

    this.localStorageService.clear('myUser');
    this.localStorageService.clear('userGuestId');
    this.localStorageService.clear('anonymousGuestId');
  }

}
