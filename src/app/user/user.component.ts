import {Component, OnInit} from '@angular/core';
import {App_userApi} from '../../abp-http/ut-api-js-services/api/App_userApi';
import {App_activityApi} from '../../abp-http/ut-api-js-services/api/App_activityApi';
import {UserDto} from '../../abp-http/ut-api-js-services/model/UserDto';
import {ActivatedRoute, Router} from '@angular/router';
import {App_activityTemplateApi} from '../../abp-http/ut-api-js-services/api/App_activityTemplateApi';
import {App_activityPlanApi} from '../../abp-http/ut-api-js-services/api/App_activityPlanApi';
import {ActivityPlanDto} from '../../abp-http/ut-api-js-services/model/ActivityPlanDto';
import {ActivityTemplateListDto} from '../../abp-http/ut-api-js-services/model/ActivityTemplateListDto';
import {ActivityListDto} from '../../abp-http/ut-api-js-services/model/ActivityListDto';
import {LocalStorageService} from 'ng2-webstorage';
import {App_friendInvitationApi} from '../../abp-http/ut-api-js-services/api/App_friendInvitationApi';
import {UserService} from '../user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public isMyUser = false;
  public isFriend = false;
  public hasInvited = false;

  public user: UserDto;

  public activities: ActivityListDto[] = [];
  public activityTemplates: ActivityTemplateListDto[] = [];
  public activityPlans: ActivityPlanDto[] = [];

  public pageControls = {
    isLoadedActivities: false,
    isLoadedActivityTemplates: false,
    isLoadedActivityPlans: false
  };

  public numberOfFriends: number;

  private id: number;

  public calendarOptions = {
    height: 700,
    editable: false,
    events: []
  };

  constructor(private router: Router,
              private route: ActivatedRoute,
              private localStorageService: LocalStorageService,
              private activityApi: App_activityApi,
              private activityTemplateApi: App_activityTemplateApi,
              private activityPlanApi: App_activityPlanApi,
              private friendInvitationApi: App_friendInvitationApi,
              private userApi: App_userApi,
              private userService: UserService) {
  }

  ngOnInit() {
    this.route.params
      .map(params => {
        const id: number = params['id'];

        this.id = id;

        return id;
      })
      .subscribe(id => {
        this.isMyUser = this.userService.checkIsMyUser(id);

        if (this.isMyUser) {
          this.getMyUserAndMyActivities();
        } else {
          this.getUserAndActivities(id);
        }
      });
  }

  public onClickAddFriend() {
    this.hasInvited = true;
    this.friendInvitationApi
      .appFriendInvitationCreateFriendInvitation({inviteeId: this.user.id})
      .subscribe((output) => {
      });
  }

  public onClickUnFriend() {
    // this.friendInvitationApi
    //   .appFriendInvitationCreateFriendInvitation({inviteeId: this.user.id})
    //   .subscribe((output) => {
    //   });
  }

  private getMyUserAndMyActivities() {
    const getMyUserSubscription = this.userApi
      .appUserGetMyUser()
      .subscribe(output => {
        this.user = output.myUser;
        this.numberOfFriends = output.numberOfFriends;

        this.localStorageService.store('myUser', output.myUser);
        this.localStorageService.store('userGuestId', output.guestId);

        getMyUserSubscription.unsubscribe();
      });

    const getMyActivitiesSubscription = this.activityApi
      .appActivityGetMyActivities()
      .subscribe(output => {
        const myActivities = output.myActivities;

        for (let i = 0; i < myActivities.length; i++) {
          const myActivity = myActivities[i];

          if (myActivity.startTime) {
            this.calendarOptions.events.push({
              title: myActivity.name,
              start: myActivity.startTime,
              end: myActivity.endTime,
              url: this.router.createUrlTree(['./activity', myActivity.id]).toString()
            });
          }
        }

        this.pageControls.isLoadedActivities = true;

        getMyActivitiesSubscription.unsubscribe();
      });

    this.getActivityTemplates(this.id);
    this.getActivityPlans(this.id);
  }

  private getUserAndActivities(id) {
    const getUserSubscription = this.userApi
      .appUserGetUser({id: id})
      .subscribe(output => {
        this.user = output.user;
        this.numberOfFriends = output.numberOfFriends;
        this.isFriend = output.isFriend;
        this.hasInvited = output.hasInvited;

        getUserSubscription.unsubscribe();
      });

    const getActivitiesSubscription = this.activityApi
      .appActivityGetActivities({userId: this.id})
      .subscribe(output => {
        const activities = output.activities;

        for (let i = 0; i < activities.length; i++) {
          const activity = activities[i];

          if (activity.startTime) {
            this.calendarOptions.events.push({
              title: activity.name,
              start: activity.startTime,
              end: activity.endTime,
              url: this.router.createUrlTree(['./activity', activity.id]).toString()
            });
          }
        }

        this.pageControls.isLoadedActivities = true;

        getActivitiesSubscription.unsubscribe();
      });

    this.getActivityTemplates(id);
    this.getActivityPlans(id);
  }

  private getActivityTemplates(userId) {
    const getActivityTemplatesSubscription = this.activityTemplateApi
      .appActivityTemplateGetActivityTemplates({userId: userId, maxResultCount: 9})
      .subscribe(output => {
        const activityTemplates = output.activityTemplates;

        for (let i = 0; i < activityTemplates.length; i++) {
          this.activityTemplates.push(activityTemplates[i]);
        }

        this.pageControls.isLoadedActivityTemplates = true;

        getActivityTemplatesSubscription.unsubscribe();
      });
  }

  private getActivityPlans(userId) {
    const getActivityPlansSubscription = this.activityPlanApi
      .appActivityPlanGetActivityPlans({userId: userId, maxResultCount: 9})
      .subscribe(output => {
        const activityPlans = output.activityPlans;

        for (let i = 0; i < activityPlans.length; i++) {
          this.activityPlans.push(activityPlans[i]);
        }

        this.pageControls.isLoadedActivityPlans = true;

        getActivityPlansSubscription.unsubscribe();
      });
  }

}


