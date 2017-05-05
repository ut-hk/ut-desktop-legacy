import { Component, OnInit } from '@angular/core';
import { App_userApi } from '../../abp-http/ut-api-js-services/api/App_userApi';
import { App_activityApi } from '../../abp-http/ut-api-js-services/api/App_activityApi';
import { UserDto } from '../../abp-http/ut-api-js-services/model/UserDto';
import { ActivatedRoute } from '@angular/router';
import { App_activityTemplateApi } from '../../abp-http/ut-api-js-services/api/App_activityTemplateApi';
import { App_activityPlanApi } from '../../abp-http/ut-api-js-services/api/App_activityPlanApi';
import { ActivityPlanDto } from '../../abp-http/ut-api-js-services/model/ActivityPlanDto';
import { ActivityTemplateListDto } from '../../abp-http/ut-api-js-services/model/ActivityTemplateListDto';
import { ActivityListDto } from '../../abp-http/ut-api-js-services/model/ActivityListDto';
import { LocalStorageService } from 'ngx-webstorage';
import { App_friendInvitationApi } from '../../abp-http/ut-api-js-services/api/App_friendInvitationApi';
import { UserService } from '../user.service';
import { Subject } from 'rxjs/Subject';
import { CalendarEvent, CalendarEventTitleFormatter } from 'angular-calendar/dist/esm/src';
import { ActivityEvent } from '../activity-event';
import * as moment from 'moment';
import { CustomEventTitleFormatter } from '../custom-event-title-formatter';
import { calendarColors } from '../calendar-colors';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [{
    provide: CalendarEventTitleFormatter,
    useClass: CustomEventTitleFormatter
  }]
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
    isLoadedActivityTemplates: false,
    isLoadedActivityPlans: false
  };

  public calendarControls: { viewDate: Date, events: ActivityEvent[], refresh: Subject<any>, activeDayIsOpen: boolean } = {
    viewDate: new Date(),
    events: [],
    refresh: new Subject(),
    activeDayIsOpen: false
  };

  public numberOfFriends: number;

  private id: number;

  constructor(private route: ActivatedRoute,
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

  public onDayClicked({date, events}: { date: Date, events: CalendarEvent[] }): void {
    this.calendarControls.viewDate = date;
    this.calendarControls.activeDayIsOpen = events.length > 0;
  }

  public onEventClicked(action: string, event: CalendarEvent): void {
    // this.modalData = {event, action};
    // this.modal.open(this.modalContent, {size: 'lg'});
  }

  private addToCalendar(activity: ActivityListDto) {
    const event: ActivityEvent = {
      id: activity.id,
      title: activity.name,
      color: calendarColors.red,
      start: moment(activity.startTime).toDate(),
      end: moment(activity.endTime).toDate(),
      activity: activity,
      resizable: {
        beforeStart: false,
        afterEnd: false
      },
      draggable: false
    };

    this.calendarControls.events.push(event);
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
            this.addToCalendar(myActivity);
          }
        }

        this.calendarControls.refresh.next();

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
            this.addToCalendar(activity);
          }
        }

        this.calendarControls.refresh.next();

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


