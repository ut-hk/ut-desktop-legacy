import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CreateTextCommentInput} from '../../abp-http/ut-api-js-services/model/CreateTextCommentInput';
import {App_commentApi} from '../../abp-http/ut-api-js-services/api/App_commentApi';
import {App_activityApi} from '../../abp-http/ut-api-js-services/api/App_activityApi';
import {CreateReplyInput} from '../../abp-http/ut-api-js-services/model/CreateReplyInput';
import {CommentDto} from '../../abp-http/ut-api-js-services/model/CommentDto';
import {App_replyApi} from '../../abp-http/ut-api-js-services/api/App_replyApi';
import {ActivityDto, CreateActivityInvitationsInput} from 'abp-http/ut-api-js-services';
import {UserService} from '../user.service';
import {UserListDto} from '../../abp-http/ut-api-js-services/model/UserListDto';
import {App_relationshipApi} from '../../abp-http/ut-api-js-services/api/App_relationshipApi';
import {UserDto} from '../../abp-http/ut-api-js-services/model/UserDto';
import {LocalStorageService} from 'ng2-webstorage';
import {App_activityInvitationApi} from '../../abp-http/ut-api-js-services/api/App_activityInvitationApi';


interface ParticipantIdInput {
  user: UserListDto;
  isSelected: boolean;
}

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})

export class ActivityComponent implements OnInit {

  public pageControls = {
    isMyUser: false
  };


  public isMyActivity = false;
  public myUser: UserDto = null;
  public friends: UserListDto[] = null;

  public participantIdInputs: ParticipantIdInput[] = [];

  public createActivityInvitationInput: CreateActivityInvitationsInput = {
    content: null,
    activityId: null,
    inviteeIds: []
  };

  public activityId;
  public activity: ActivityDto;
  @ViewChild('inviteFriendModal') public inviteFriendModal;


  public createTextCommentInput: CreateTextCommentInput = {
    content: ''
  };
  public createReplyInput: CreateReplyInput = {
    content: ''
  };

  constructor(private route: ActivatedRoute,
              private activityApi: App_activityApi,
              private commentApi: App_commentApi,
              private replyApi: App_replyApi,
              private userService: UserService,
              private relationshipApi: App_relationshipApi,
              private activityInvitationApi: App_activityInvitationApi,
              private localStorageService: LocalStorageService,
              private router: Router) {
  }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        const id = params['id'];

        this.activityId = id;
        this.createTextCommentInput.activityId = id;
        this.createActivityInvitationInput.activityId = id;

        this.getActivity();

      });
  }

  public onEdit() {
  }

  public onDelete() {
    this.activityApi
      .appActivityRemoveActivity({id: this.activityId})
      .subscribe(() => {
        this.router.navigate(['./world']);
      });
  }

  public onClickCreateTextComment() {
    const createTextCommentSubscription = this.commentApi
      .appCommentCreateTextComment(this.createTextCommentInput)
      .subscribe(output => {
        this.getActivity();

        createTextCommentSubscription.unsubscribe();
      });
  }

  public onClickCreateReply(comment: CommentDto) {
    this.createReplyInput.commentId = comment.id;

    const createTextCommentSubscription = this.replyApi
      .appReplyCreateReply(this.createReplyInput)
      .subscribe(output => {
        this.getActivity();

        this.createReplyInput.commentId = null;

        createTextCommentSubscription.unsubscribe();
      });
  }

  public onClickInviteFriendToActivity() {

    for (let i = 0; i < this.participantIdInputs.length; i++) {
      if (this.participantIdInputs[i].isSelected == true) {
        this.createActivityInvitationInput.inviteeIds.push(this.participantIdInputs[i].user.id);
      } else {
        if (this.participantIdInputs[i].isSelected == false) {

        }
      }
    }
    this.activityInvitationApi
      .appActivityInvitationCreateActivityInvitations(this.createActivityInvitationInput)
      .subscribe((output) => {
        console.log(output);
      });

    this.inviteFriendModal.hide();
  }

  private getActivity() {
    this.createTextCommentInput.content = '';

    this.activityApi
      .appActivityGetActivity({id: this.activityId})
      .subscribe((output) => {
        const activity = output.activity;

        this.activity = activity;
        this.pageControls.isMyUser = this.userService.checkIsMyUser(activity.owner.id);
        if (this.pageControls.isMyUser == true) {
          this.myUser = this.localStorageService.retrieve('myUser');
          this.getMyFriends();
        }
      });
  }

  private getMyFriends() {
    const getFriendsSubscription = this.relationshipApi
      .appRelationshipGetFriends({
        targetUserId: this.myUser.id
      })
      .subscribe((output) => {
        this.friends = output.friends;
        for (let i = 0; i < this.friends.length; i++) {
          const friendInput: ParticipantIdInput = {user: this.friends[i], isSelected: false};
          this.participantIdInputs.push(friendInput);
        }

        getFriendsSubscription.unsubscribe();
      });
  }

}
