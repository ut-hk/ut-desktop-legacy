import { Component, OnInit } from '@angular/core';
import { App_userApi } from '../../abp-http/ut-api-js-services/api/App_userApi';
import { App_activityApi } from '../../abp-http/ut-api-js-services/api/App_activityApi';
import { UserDto } from '../../abp-http/ut-api-js-services/model/UserDto';
import { ActivityDto } from '../../abp-http/ut-api-js-services/model/ActivityDto';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public isMyUser = false;
  public activities: ActivityDto[] = [];
  public user: UserDto;

  private id: number;

  constructor(private route: ActivatedRoute,
              private localStorageService: LocalStorageService,
              private activityService: App_activityApi,
              private userService: App_userApi) {
  }

  ngOnInit() {
    this.route.params
      .map(params => {
        const id: number = params['id'];

        this.id = id;

        return id;
      })
      .subscribe(id => {
        this.isMyUser = this.checkIsMyUser(id);

        if (this.isMyUser) {
          this.getMyUserAndMyActivities();
        } else {
          this.getUserAndActivities(id);
        }
      });
  }

  private checkIsMyUser(userId: number): boolean {
    const myUser = this.localStorageService.get<UserDto>('myUser');

    return myUser.id === userId;
  }

  private getMyUserAndMyActivities() {
    const getMyUserSubscription = this.userService
      .appUserGetMyUser()
      .subscribe(output => {
        this.user = output.myUser;

        this.localStorageService.set('myUser', output.myUser);
        this.localStorageService.set('userGuestId', output.guestId);

        getMyUserSubscription.unsubscribe();
      });

    const getMyActivitiesSubscription = this.activityService
      .appActivityGetMyActivities()
      .subscribe(output => {
        const activities = output.myActivities;

        for (let i = 0; i < activities.length; i++) {
          this.activities.push(activities[i]);
        }

        getMyActivitiesSubscription.unsubscribe();
      });
  }

  private getUserAndActivities(id) {
    const getUserSubscription = this.userService
      .appUserGetUser({id: id})
      .subscribe(output => {
        this.user = output.user;

        getUserSubscription.unsubscribe();
      });

    const getActivitiesSubscription = this.activityService
      .appActivityGetActivities({userId: id})
      .subscribe(output => {
        const activities = output.activities;

        for (let i = 0; i < activities.length; i++) {
          this.activities.push(activities[i]);
        }

        getActivitiesSubscription.unsubscribe();
      });
  }

}


