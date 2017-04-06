import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../abp-http/http/token.service';
import { LogInInput } from '../../abp-http/ut-api-js-services/model/LogInInput';
import { AccountApi } from '../../abp-http/ut-api-js-services/api/AccountApi';
import { App_userApi } from '../../abp-http/ut-api-js-services/api/App_userApi';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router, ActivatedRoute } from '@angular/router';


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
              private userService: App_userApi,
              private router: Router) {
  }

  ngOnInit() {
  }

  public logIn() {
    const subscription = this.accountService
      .accountLogInWithHttpInfo(this.logInInput)
      .flatMap((output) => {
        this.tokenService.setToken(output.text());

        return this.userService
          .appUserGetMyUser({});
      })
      .subscribe((output) => {
        this.localStorageService.set('myUser', output.myUser);
        this.localStorageService.set('userGuestId', output.guestId);

        if (output.myUser.gender == null) {
          this.router.navigate(['./sign-up-profile']);
        } else {
          this.router.navigate(['./world']);
        }

        subscription.unsubscribe();
      });
  }

}
