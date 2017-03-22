import {Component, OnInit} from '@angular/core';
import {Http, Headers, URLSearchParams}                    from '@angular/http';
import {RequestMethod, RequestOptions, RequestOptionsArgs} from '@angular/http';
import {Response, ResponseContentType}                     from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import {LogInInput} from "../../abp-http/ut-api-js-services/model/LogInInput";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  public SignUpInput = {
    userName: '',
    emailAddress: '',
    password: '',
    name: '',
    surname: ''
  }

  constructor(protected http: Http,private router: Router) {
    console.log("Hello World");
    console.log(this);

  }

  ngOnInit() {
  }

  public register() {
    console.log("ca");
    let requestedUrl = 'http://unitime-dev-api.azurewebsites.net/Account/Register';
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});

    this.http.post(requestedUrl, this.SignUpInput, options).subscribe((output) => {
      this.router.navigate(['./world']);
    });

  }

}
