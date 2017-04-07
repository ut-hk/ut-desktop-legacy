import { Component, OnInit } from '@angular/core';
import { App_userApi } from '../../abp-http/ut-api-js-services/api/App_userApi';
import { App_activityApi } from '../../abp-http/ut-api-js-services/api/App_activityApi';
import { UserDto } from '../../abp-http/ut-api-js-services/model/UserDto';
import { ActivityDto } from '../../abp-http/ut-api-js-services/model/ActivityDto';
import { ActivatedRoute } from '@angular/router';
import { App_activityTemplateApi } from '../../abp-http/ut-api-js-services/api/App_activityTemplateApi';
import { App_activityPlanApi } from '../../abp-http/ut-api-js-services/api/App_activityPlanApi';
import { ActivityTemplateDto } from '../../abp-http/ut-api-js-services/model/ActivityTemplateDto';
import { ActivityPlanDto } from '../../abp-http/ut-api-js-services/model/ActivityPlanDto';
import { ActivityTemplateListDto } from '../../abp-http/ut-api-js-services/model/ActivityTemplateListDto';
import { ActivityListDto } from '../../abp-http/ut-api-js-services/model/ActivityListDto';
import { LocalStorageService } from 'ng2-webstorage';
import { App_relationshipApi } from '../../abp-http/ut-api-js-services/api/App_relationshipApi';
import { App_friendInvitationApi } from '../../abp-http/ut-api-js-services/api/App_friendInvitationApi';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public isMyUser = false;

  public isFriend = false;

  public isInvited = false;

  public user: UserDto;

  public activities: ActivityListDto[] = [];
  public activityTemplates: ActivityTemplateListDto[] = [];
  public activityPlans: ActivityPlanDto[] = [];

  private id: number;

  constructor(private route: ActivatedRoute,
              private localStorageService: LocalStorageService,
              private activityApi: App_activityApi,
              private activityTemplateApi: App_activityTemplateApi,
              private activityPlanApi: App_activityPlanApi,
              private friendInvitationApi: App_friendInvitationApi,
              private userApi: App_userApi) {

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

  public onClickAddFriend() {
    this.friendInvitationApi
      .appFriendInvitationCreateFriendInvitation({inviteeId: this.user.id})
      .subscribe((output) => {
        console.log(output);
      });
  }

  private checkIsMyUser(userId: number): boolean {
    const myUser = this.localStorageService.retrieve('myUser');

    if (myUser == null) {
      return false;
    }


    return myUser.id == userId;
  }

  private getMyUserAndMyActivities() {
    const getMyUserSubscription = this.userApi
      .appUserGetMyUser()
      .subscribe(output => {
        this.user = output.myUser;

        this.localStorageService.store('myUser', output.myUser);
        this.localStorageService.store('userGuestId', output.guestId);

        getMyUserSubscription.unsubscribe();
      });

    const getMyActivitiesSubscription = this.activityApi
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
    const getUserSubscription = this.userApi
      .appUserGetUser({id: id})
      .subscribe(output => {
        this.user = output.user;

        getUserSubscription.unsubscribe();
      });

    const getActivitiesSubscription = this.activityApi
      .appActivityGetActivities({userId: id})
      .subscribe(output => {
        const activities = output.activities;

        for (let i = 0; i < activities.length; i++) {
          this.activities.push(activities[i]);
        }

        getActivitiesSubscription.unsubscribe();
      });


    const getActivityTemplatesSubscription = this.activityTemplateApi
      .appActivityTemplateGetActivityTemplates({userId: id, maxResultCount: 9})
      .subscribe(output => {
        const activityTemplates = output.activityTemplates;

        console.log(activityTemplates.length);
        for (let i = 0; i < activityTemplates.length; i++) {
          this.activityTemplates.push(activityTemplates[i]);
        }

        getActivityTemplatesSubscription.unsubscribe();
      });


    const getActivityPlansSubscription = this.activityPlanApi
      .appActivityPlanGetActivityPlans({userId: id, maxResultCount: 9})
      .subscribe(output => {
        const activityPlans = output.activityPlans;

        for (let i = 0; i < activityPlans.length; i++) {
          this.activityPlans.push(activityPlans[i]);
        }

        getActivityPlansSubscription.unsubscribe();
      });

  }

}


