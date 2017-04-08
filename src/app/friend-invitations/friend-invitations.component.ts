import { Component, OnInit } from '@angular/core';
import { App_friendInvitationApi } from '../../abp-http/ut-api-js-services/api/App_friendInvitationApi';
import { FriendInvitationDto } from '../../abp-http/ut-api-js-services/model/FriendInvitationDto';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-friend-invitations',
  templateUrl: './friend-invitations.component.html',
  styleUrls: ['./friend-invitations.component.scss']
})
export class FriendInvitationsComponent implements OnInit {

  private friendInvitations: Observable<FriendInvitationDto[]>;

  constructor(private friendInvitationApi: App_friendInvitationApi) {
  }

  ngOnInit() {
    this.friendInvitations = this.friendInvitationApi
      .appFriendInvitationGetMyPendingFriendInvitations()
      .map(output => {
        return output.friendInvitations;
      });
  }

  public onClickAccept(friendInvitation: FriendInvitationDto) {
    const subscription = this.friendInvitationApi
      .appFriendInvitationAcceptFriendInvitation({id: friendInvitation.id})
      .subscribe(output => {
        subscription.unsubscribe();
      });
  }

  public onClickReject(friendInvitation: FriendInvitationDto) {
    const subscription = this.friendInvitationApi
      .appFriendInvitationRejectFriendInvitation({id: friendInvitation.id})
      .subscribe(output => {
        subscription.unsubscribe();
      });
  }

  public onClickIgnore(friendInvitation: FriendInvitationDto) {
    const subscription = this.friendInvitationApi
      .appFriendInvitationIgnoreFriendInvitation({id: friendInvitation.id})
      .subscribe(output => {
        subscription.unsubscribe();
      });
  }

}
