import { Component, OnInit } from '@angular/core';
import { App_activityTemplateApi } from '../../abp-http/ut-api-js-services/api/App_activityTemplateApi';
import { ActivatedRoute } from '@angular/router';
import { CreateTextCommentInput } from '../../abp-http/ut-api-js-services/model/CreateTextCommentInput';
import { App_commentApi } from '../../abp-http/ut-api-js-services/api/App_commentApi';
import { App_activityApi } from '../../abp-http/ut-api-js-services/api/App_activityApi';
import { CreateReplyInput } from '../../abp-http/ut-api-js-services/model/CreateReplyInput';
import { CommentDto } from '../../abp-http/ut-api-js-services/model/CommentDto';
import { App_replyApi } from '../../abp-http/ut-api-js-services/api/App_replyApi';
import { ActivityDto } from 'abp-http/ut-api-js-services';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {

  public activityId: string;
  public activity: ActivityDto;

  public createTextCommentInput: CreateTextCommentInput = {
    content: ''
  };
  public createReplyInput: CreateReplyInput = {
    content: ''
  };

  constructor(private route: ActivatedRoute,
              private activityTemplateApi: App_activityTemplateApi,
              private activityApi: App_activityApi,
              private commentApi: App_commentApi,
              private replyApi: App_replyApi) {
    const currentDate = new Date();

  }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        const id = params['id'];

        this.activityId = id;

        this.createTextCommentInput.activityId = id;

        this.getactivity();
      });
  }

  public onClickCreateTextComment() {
    const createTextCommentSubscription = this.commentApi
      .appCommentCreateTextComment(this.createTextCommentInput)
      .subscribe(output => {
        this.getactivity();

        createTextCommentSubscription.unsubscribe();
      });
  }

  public onClickCreateReply(comment: CommentDto) {
    this.createReplyInput.commentId = comment.id;

    const createTextCommentSubscription = this.replyApi
      .appReplyCreateReply(this.createReplyInput)
      .subscribe(output => {
        this.getactivity();

        this.createReplyInput.commentId = null;

        createTextCommentSubscription.unsubscribe();
      });
  }


  private getactivity() {
    this.createTextCommentInput.content = '';

    this.activityApi
      .appActivityGetActivity({id: this.activityId})
      .subscribe((output) => {
        this.activity = output.activity;
      });
  }


}
