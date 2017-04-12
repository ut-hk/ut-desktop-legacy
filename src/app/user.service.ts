import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ng2-webstorage';

@Injectable()
export class UserService {

  constructor(private localStorageService: LocalStorageService) { }

  public checkIsMyUser(userId: number): boolean {
    const myUser = this.localStorageService.retrieve('myUser');

    if (myUser == null) {
      return false;
    }

    return myUser.id == userId;
  }

}
