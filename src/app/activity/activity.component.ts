import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateTextCommentInput } from '../../abp-http/ut-api-js-services/model/CreateTextCommentInput';
import { App_commentApi } from '../../abp-http/ut-api-js-services/api/App_commentApi';
import { App_activityApi } from '../../abp-http/ut-api-js-services/api/App_activityApi';
import { CreateReplyInput } from '../../abp-http/ut-api-js-services/model/CreateReplyInput';
import { CommentDto } from '../../abp-http/ut-api-js-services/model/CommentDto';
import { App_replyApi } from '../../abp-http/ut-api-js-services/api/App_replyApi';
import { ActivityDto } from 'abp-http/ut-api-js-services';
import { UserService } from '../user.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {

  public pageControls = {
    isMyUser: false
  };

  public activityId;
  public activity: ActivityDto;

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
              private router: Router) {
  }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        const id = params['id'];

        this.activityId = id;
        this.createTextCommentInput.activityId = id;

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

  private getActivity() {
    this.createTextCommentInput.content = '';

    this.activityApi
      .appActivityGetActivity({id: this.activityId})
      .subscribe((output) => {
        const activity = output.activity;

        this.activity = activity;
        this.pageControls.isMyUser = this.userService.checkIsMyUser(activity.owner.id);
      });
  }

}
