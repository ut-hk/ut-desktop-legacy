import { Component } from '@angular/core';
import { App_userApi } from "../abp-http/ut-api-js-services/api/App_userApi";
import { LocalStorageService } from "angular-2-local-storage";
import { UserDto } from "../abp-http/ut-api-js-services/model/UserDto";
import { TokenService } from "../abp-http/http/token.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public isCollapsed: boolean = true;
  public myUser: UserDto;
  public show: boolean = false;

  constructor(private localStorageService: LocalStorageService,
              private tokenService: TokenService,
              private userService: App_userApi) {
  }

  ngOnInit() {
    this.myUser = this.localStorageService.get('myUser');

    if (this.tokenService.getToken())
      this.userService
        .appUserGetMyUser({})
        .subscribe((output) => {
          this.localStorageService.set('myUser', output.myUser);
          this.myUser = output.myUser;
        });
  }

  public toggleNavigation() {
    this.isCollapsed = !this.isCollapsed;
  }

  public collapsed(event: any): void {
    console.log(event);
  }

  public expanded(event: any): void {
    console.log(event);
  }
}
