import { Component, OnInit } from '@angular/core';
import { App_userApi } from '../abp-http/ut-api-js-services/api/App_userApi';
import { LocalStorageService } from 'angular-2-local-storage';
import { UserDto } from '../abp-http/ut-api-js-services/model/UserDto';
import { TokenService } from '../abp-http/http/token.service';
import { NavigationStart, Router, RoutesRecognized } from '@angular/router';
import { App_analysisApi } from '../abp-http/ut-api-js-services/api/App_analysisApi';
import { EntityDtoGuid } from '../abp-http/ut-api-js-services/model/EntityDtoGuid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public isCollapsed = true;
  public myUser: UserDto = null;
  public guest: EntityDtoGuid = null;
  public depth = 0;

  constructor(private localStorageService: LocalStorageService,
              private router: Router,
              private tokenService: TokenService,
              private userService: App_userApi,
              private analysisService: App_analysisApi) {

    this.myUser = this.localStorageService.get('myUser');
    this.guest = localStorageService.get<EntityDtoGuid>('guest');
  }

  ngOnInit() {
    if (this.tokenService.getToken()) {
      this.userService
        .appUserGetMyUser({})
        .subscribe((output) => {
          this.localStorageService.set('myUser', output.myUser);
          this.myUser = output.myUser;
        });
    }

    this.router.events.subscribe((event) => {
      if (event instanceof RoutesRecognized) {
        this.isCollapsed = true;

        this.createHistory(event.urlAfterRedirects);
      }
    });
  }

  public toggleNavigation() {
    this.isCollapsed = !this.isCollapsed;
  }

  public collapsed(event: any): void {
  }

  public expanded(event: any): void {
  }

  private createHistory(urlAfterRedirects: string): void {
    const parameters = {
      depth: this.depth
    };

    if (this.guest != null) {
      this.analysisService.appAnalysisCreateRouteHistory({
        guestId: this.guest.id,
        routeName: urlAfterRedirects,
        parameters: JSON.stringify(parameters)
      }).subscribe((output) => {
        console.log(output);
      });
    } else {
      this.createGuest();
    }

    this.depth = this.depth + 1;
  }

  private createGuest(): void {
    this.analysisService.appAnalysisCreateGuest({})
      .subscribe((output) => {
        this.localStorageService.add('guest', output);
        this.guest = output;
      });
  }
}
