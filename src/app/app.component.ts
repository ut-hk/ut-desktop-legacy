import { Component, OnInit } from '@angular/core';
import { App_userApi } from '../abp-http/ut-api-js-services/api/App_userApi';
import { UserDto } from '../abp-http/ut-api-js-services/model/UserDto';
import { TokenService } from '../abp-http/http/token.service';
import { Router, RoutesRecognized } from '@angular/router';
import { App_analysisApi } from '../abp-http/ut-api-js-services/api/App_analysisApi';
import { EntityDtoGuid } from '../abp-http/ut-api-js-services/model/EntityDtoGuid';
import { environment } from '../environments/environment';
import { LocalStorage, LocalStorageService } from 'ng2-webstorage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public isCollapsed = true;
  public depth = -1;

  public myUser: UserDto;

  constructor(private router: Router,
              private localStorageService: LocalStorageService,
              private tokenService: TokenService,
              private userApi: App_userApi,
              private analysisApi: App_analysisApi) {
    this.checkVersion();
  }

  private checkVersion() {
    const version = this.localStorageService.retrieve('version');

    if (version !== environment.version) {
      this.localStorageService.clear();
      this.localStorageService.store('version', environment.version);
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

  public logOut() {
    this.tokenService.clearToken();

    this.localStorageService.clear('myUser');
    this.localStorageService.clear('userGuestId');
    this.localStorageService.clear('anonymousGuestId');

    this.router.navigate(['./log-in']);
  }

  private initializeMyUser() {
    if (this.tokenService.getToken()) {
      const subscription = this.userApi
        .appUserGetMyUser({})
        .subscribe((output) => {
          this.localStorageService.store('myUser', output.myUser);
          this.localStorageService.store('userGuestId', output.guestId);

          this.myUser = output.myUser;

          subscription.unsubscribe();
        });
    } else {
      const anonymousGuestId = this.localStorageService.retrieve('anonymousGuestId');

      if (anonymousGuestId == null) {
        const subscription = this.analysisApi.appAnalysisGetGuest({})
          .subscribe((output) => {
            this.localStorageService.store('anonymousGuestId', output.id);

            subscription.unsubscribe();
          });
      }
    }
  }

  private initializeRouteHistoryWatcher() {
    this.router.events.subscribe((event) => {
      if (event instanceof RoutesRecognized) {
        this.isCollapsed = true;
        this.myUser = this.localStorageService.retrieve('myUser');

        this.createHistory(event.urlAfterRedirects);
      }
    });
  }

  private createHistory(urlAfterRedirects: string): void {
    this.depth = this.depth + 1;

    const anonymousGuestId = this.localStorageService.retrieve('anonymousGuestId');
    const userGuestId = this.localStorageService.retrieve('userGuestId');
    const guestId = userGuestId != null ? userGuestId : anonymousGuestId;

    if (guestId == null) {
      return;
    }

    const parameters = {
      depth: this.depth
    };

    const subscription = this.analysisApi.appAnalysisCreateRouteHistory({
      guestId: guestId,
      routeName: urlAfterRedirects,
      parameters: JSON.stringify(parameters)
    }).subscribe(() => {
      subscription.unsubscribe();
    });
  }
}
