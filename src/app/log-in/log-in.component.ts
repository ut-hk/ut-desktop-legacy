import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../abp-http/http/token.service';
import { LogInInput } from '../../abp-http/ut-api-js-services/model/LogInInput';
import { AccountApi } from '../../abp-http/ut-api-js-services/api/AccountApi';
import { App_userApi } from '../../abp-http/ut-api-js-services/api/App_userApi';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';


@Component({
  selector: 'app-log-in',
  templateUrl: 'log-in.component.html',
  styleUrls: ['log-in.component.scss']
})
export class LogInComponent implements OnInit {

  public logInInput: LogInInput = {
    usernameOrEmailAddress: '',
    password: ''
  };

  constructor(private tokenService: TokenService,
              private localStorageService: LocalStorageService,
              private accountApi: AccountApi,
              private userApi: App_userApi,
              private router: Router) {
  }

  ngOnInit() {
  }

  public logIn() {
    // Request server to validate login form
    const subscription = this.accountApi
      .accountLogInWithHttpInfo(this.logInInput)
      .flatMap((output) => {
        this.tokenService.setToken(output.text());

        return this.userApi
          .appUserGetMyUser({});
      })
      .subscribe((output) => {
        this.localStorageService.store('myUser', output.myUser);
        this.localStorageService.store('userGuestId', output.guestId);

        if (output.myUser.gender == null) {
          this.router.navigate(['./sign-up-profile']);
        } else {
          this.router.navigate(['./world']);
        }

        subscription.unsubscribe();
      });
  }

}
