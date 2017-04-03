import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { AccountApi } from '../../abp-http/ut-api-js-services/api/AccountApi';
import { TokenService } from '../../abp-http/http/token.service';
import { SignUpInput } from '../../abp-http/ut-api-js-services/model/SignUpInput';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  public signUpInput: SignUpInput = {
    userName: '',
    emailAddress: '',
    password: '',
    name: '',
    surname: ''
  };

  constructor(private router: Router,
              private accountService: AccountApi,
              private tokenService: TokenService) {
  }

  ngOnInit() {
  }

  public signUp() {
    this.accountService
      .accountSignUpWithHttpInfo(this.signUpInput)
      .subscribe(output => {
        this.tokenService.setToken(output.text());

        this.router.navigate(['./sign-up-profile']);
      });
  }

}
