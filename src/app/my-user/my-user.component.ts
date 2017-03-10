import { Component, OnInit } from '@angular/core';
import { App_userApi } from "../../abp-http/ut-api-js-services/api/App_userApi";
import { UserDto } from "../../abp-http/ut-api-js-services/model/UserDto";
import { LocalStorageService } from "angular-2-local-storage";

@Component({
  selector: 'app-my-user',
  templateUrl: './my-user.component.html',
  styleUrls: ['./my-user.component.scss']
})
export class MyUserComponent implements OnInit {

  public myUser: UserDto;

  constructor(private localStorageService: LocalStorageService,
              private userService: App_userApi) {
  }

  ngOnInit() {
    this.userService
      .appUserGetMyUser({})
      .subscribe((output) => {
        this.localStorageService.set('myUser', output.myUser);
        this.myUser = output.myUser;
      });
  }

}
