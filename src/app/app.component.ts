import { Component, OnInit } from '@angular/core';
import { App_userApi } from '../abp-http/ut-api-js-services/api/App_userApi';
import { LocalStorageService } from 'angular-2-local-storage';
import { UserDto } from '../abp-http/ut-api-js-services/model/UserDto';
import { TokenService } from '../abp-http/http/token.service';
import { Router, RoutesRecognized } from '@angular/router';
import { App_analysisApi } from '../abp-http/ut-api-js-services/api/App_analysisApi';
import { EntityDtoGuid } from '../abp-http/ut-api-js-services/model/EntityDtoGuid';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public isCollapsed = true;
  public depth = -1;

  public myUser: UserDto = null;

  constructor(private localStorageService: LocalStorageService,
              private router: Router,
              private tokenService: TokenService,
              private userService: App_userApi,
              private analysisService: App_analysisApi) {
    this.checkVersion();
  }

  private checkVersion() {
    const version = this.localStorageService.get<string>('version');

    if (version !== environment.version) {
      this.localStorageService.clearAll();
      this.localStorageService.set('version', environment.version);
    }
  }

  ngOnInit() {
    this.initializeMyUser();
    this.initializeRouteHistoryWatcher();
  }

  public toggleNavigation() {
    this.isCollapsed = !this.isCollapsed;
  }

  public collapsed(event: any): void {
  }

  public expanded(event: any): void {
  }

  private initializeMyUser() {
    if (this.tokenService.getToken()) {
      const subscription = this.userService
        .appUserGetMyUser({})
        .subscribe((output) => {
          this.localStorageService.set('myUser', output.myUser);
          this.localStorageService.set('userGuestId', output.guestId);

          this.myUser = output.myUser;

          subscription.unsubscribe();
        });
    } else {
      const anonymousGuestId = this.localStorageService.get<string>('anonymousGuestId');

      if (anonymousGuestId == null) {
        const subscription = this.analysisService.appAnalysisGetGuest({})
          .subscribe((output) => {
            this.localStorageService.set('anonymousGuestId', output.id);

            subscription.unsubscribe();
          });
      }
    }
  }

  private initializeRouteHistoryWatcher() {
    this.router.events.subscribe((event) => {
      if (event instanceof RoutesRecognized) {
        this.isCollapsed = true;
        this.myUser = this.localStorageService.get('myUser');

        this.createHistory(event.urlAfterRedirects);
      }
    });
  }

  private createHistory(urlAfterRedirects: string): void {
    this.depth = this.depth + 1;

    const anonymousGuestId = this.localStorageService.get<string>('anonymousGuestId');
    const userGuestId = this.localStorageService.get<string>('userGuestId');
    const guestId = userGuestId != null ? userGuestId : anonymousGuestId;

    if (guestId == null) {
      return;
    }

    const parameters = {
      depth: this.depth
    };

    const subscription = this.analysisService.appAnalysisCreateRouteHistory({
      guestId: guestId,
      routeName: urlAfterRedirects,
      parameters: JSON.stringify(parameters)
    }).subscribe(() => {
      subscription.unsubscribe();
    });
  }
}
