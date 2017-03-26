import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { RequestOptions } from '@angular/http';
import { Router } from '@angular/router';

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
  };

  constructor(protected http: Http, private router: Router) {
  }

  ngOnInit() {
  }

  public register() {
    const requestedUrl = 'http://unitime-dev-api.azurewebsites.net/Account/Register';
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});

    this.http.post(requestedUrl, this.SignUpInput, options).subscribe((output) => {
      this.router.navigate(['./world']);
    });
  }

}
