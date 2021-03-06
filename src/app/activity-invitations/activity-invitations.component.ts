import { Component, OnInit } from '@angular/core';
import { App_activityInvitationApi } from '../../abp-http/ut-api-js-services/api/App_activityInvitationApi';
import { ActivityInvitationDto } from '../../abp-http/ut-api-js-services/model/ActivityInvitationDto';

@Component({
  selector: 'app-activity-invitations',
  templateUrl: './activity-invitations.component.html',
  styleUrls: ['./activity-invitations.component.scss']
})
export class ActivityInvitationsComponent implements OnInit {

  public activityInvitations;

  constructor(private activityInvitationApi: App_activityInvitationApi) { }

  ngOnInit() {
    this.getMyPendingActivityInvitations();
  }

  private getMyPendingActivityInvitations() {
    const getMyPendingFriendInvitationsSubscription = this.activityInvitationApi
      .appActivityInvitationGetMyPendingActivityInvitations()
      .subscribe(output => {
        this.activityInvitations = output.activityInvitations;

        getMyPendingFriendInvitationsSubscription.unsubscribe();
      });
  }

  public onClickAccept(activityInvitation: ActivityInvitationDto) {

    const index = this.activityInvitations.indexOf(activityInvitation);
    if (index > -1) {
      this.activityInvitations.splice(index, 1);
    }

    const subscription = this.activityInvitationApi
      .appActivityInvitationAcceptActivityInvitation({id: activityInvitation.id})
      .subscribe(output => {
        this.getMyPendingActivityInvitations();

        subscription.unsubscribe();
      });
  }

  public onClickReject(activityInvitation: ActivityInvitationDto) {

    const index = this.activityInvitations.indexOf(activityInvitation);
    if (index > -1) {
      this.activityInvitations.splice(index, 1);
    }

    const subscription = this.activityInvitationApi
      .appActivityInvitationRejectActivityInvitation({id: activityInvitation.id})
      .subscribe(output => {
        this.getMyPendingActivityInvitations();

        subscription.unsubscribe();
      });
  }

  public onClickIgnore(activityInvitation: ActivityInvitationDto) {

    const index = this.activityInvitations.indexOf(activityInvitation);
    if (index > -1) {
      this.activityInvitations.splice(index, 1);
    }

    const subscription = this.activityInvitationApi
      .appActivityInvitationIgnoreActivityInvitation({id: activityInvitation.id})
      .subscribe(output => {
        this.getMyPendingActivityInvitations();

        subscription.unsubscribe();
      });
  }

}
