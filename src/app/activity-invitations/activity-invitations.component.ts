import { Component, OnInit } from '@angular/core';
import { App_activityInvitationApi } from '../../abp-http/ut-api-js-services/api/App_activityInvitationApi';
import { ActivityInvitationDto } from '../../abp-http/ut-api-js-services/model/ActivityInvitationDto';

@Component({
  selector: 'app-activity-invitations',
  templateUrl: './activity-invitations.component.html',
  styleUrls: ['./activity-invitations.component.scss']
})
export class ActivityInvitationsComponent implements OnInit {

  private activityInvitations;

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

  public onClickAccept(friendInvitation: ActivityInvitationDto) {
    const subscription = this.activityInvitationApi
      .appActivityInvitationAcceptActivityInvitation({id: friendInvitation.id})
      .subscribe(output => {
        subscription.unsubscribe();
      });
  }

  public onClickReject(friendInvitation: ActivityInvitationDto) {
    const subscription = this.activityInvitationApi
      .appActivityInvitationRejectActivityInvitation({id: friendInvitation.id})
      .subscribe(output => {
        subscription.unsubscribe();
      });
  }

  public onClickIgnore(friendInvitation: ActivityInvitationDto) {
    const subscription = this.activityInvitationApi
      .appActivityInvitationIgnoreActivityInvitation({id: friendInvitation.id})
      .subscribe(output => {
        subscription.unsubscribe();
      });
  }

}
