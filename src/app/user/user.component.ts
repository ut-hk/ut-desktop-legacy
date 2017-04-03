import {Component, OnInit} from '@angular/core';
import {App_userApi} from '../../abp-http/ut-api-js-services/api/App_userApi';
import {App_activityApi} from '../../abp-http/ut-api-js-services/api/App_activityApi';
import {UserDto} from '../../abp-http/ut-api-js-services/model/UserDto';
import {ActivityDto} from '../../abp-http/ut-api-js-services/model/ActivityDto';
import {ActivatedRoute} from '@angular/router';
import {LocalStorageService} from 'angular-2-local-storage';
import {App_activityTemplateApi} from '../../abp-http/ut-api-js-services/api/App_activityTemplateApi';
import {App_activityPlanApi} from '../../abp-http/ut-api-js-services/api/App_activityPlanApi';
import {ActivityTemplateDto} from '../../abp-http/ut-api-js-services/model/ActivityTemplateDto';
import {ActivityPlanDto} from '../../abp-http/ut-api-js-services/model/ActivityPlanDto';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public isMyUser = false;
  public activities: ActivityDto[] = [];
  public activityTemplats: ActivityTemplateDto[] = [];
  public activityPlans: ActivityPlanDto[] = [];
  public user: UserDto;
  public gender: string;

  private id: number;

  constructor(private route: ActivatedRoute,
              private localStorageService: LocalStorageService,
              private activityService: App_activityApi,
              private activityTemplateService: App_activityTemplateApi,
              private activityPlanService: App_activityPlanApi,
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
        switch (this.user.gender) {
          case 2:
            this.gender = 'Male';
            break;
          case 3:
            this.gender = 'Female';
            break;
          default:
            this.gender = 'Not Provied';
            break;

        }

        console.log(this.user);

        getUserSubscription.unsubscribe();
      });

    const getActivitiesSubscription = this.activityService
      .appActivityGetActivities({userId: id})
      .subscribe(output => {
        const activities = output.activities;

        console.log(activities.length);
        for (let i = 0; i < activities.length; i++) {
          this.activities.push(activities[i]);
          // console.log(activities[i]);
        }

        getActivitiesSubscription.unsubscribe();
      });


    const getActivityTemplatesSubscription = this.activityTemplateService
      .appActivityTemplateGetActivityTemplates({userId: id})
      .subscribe(output => {
        const activitiyTemplates = output.activityTemplates;

        console.log(activitiyTemplates.length);
        for (let i = 0; i < activitiyTemplates.length; i++) {
          this.activities.push(activitiyTemplates[i]);
          // console.log(activitiyTemplates[i]);
        }

        getActivityTemplatesSubscription.unsubscribe();
      });


    const getActivityPlansSubscription = this.activityPlanService
      .appActivityPlanGetActivityPlans({userId: id})
      .subscribe(output => {
        const activityPlans = output.activityPlans;

        console.log(activityPlans.length);
        for (let i = 0; i < activityPlans.length; i++) {
          this.activities.push(activityPlans[i]);
          // console.log(activityPlans[i]);
        }

        getActivityPlansSubscription.unsubscribe();
      });

  }

}


