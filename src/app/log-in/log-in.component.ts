import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../abp-http/http/token.service';

import { LogInInput } from '../../abp-http/ut-api-js-services/model/LogInInput';
import { AccountApi } from '../../abp-http/ut-api-js-services/api/AccountApi';
import { App_userApi } from '../../abp-http/ut-api-js-services/api/App_userApi';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'app-log-in',
  templateUrl: 'log-in.component.html',
  styleUrls: ['log-in.component.scss']
})
export class LogInComponent implements OnInit {

  public logInInput: LogInInput = {
    usernameOrEmailAddress: 'leochoi',
    password: '12345678'
  };

  constructor(private tokenService: TokenService,
              private localStorageService: LocalStorageService,
              private accountService: AccountApi,
              private userService: App_userApi) {
  }

  ngOnInit() {
  }

  public logIn() {
    this.accountService
      .accountAuthenticateWithHttpInfo(this.logInInput)
      .subscribe((output) => {
        this.tokenService.setToken(output['_body']);

        this.userService
          .appUserGetMyUser({})
          .subscribe((output) => {
            this.localStorageService.set('myUser', output.myUser);
          });
      });
  }

}
