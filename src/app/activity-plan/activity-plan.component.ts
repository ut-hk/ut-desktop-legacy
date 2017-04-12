import { Component, OnInit } from '@angular/core';
import { ActivityPlanDto } from '../../abp-http/ut-api-js-services/model/ActivityPlanDto';
import { CreateTextCommentInput } from '../../abp-http/ut-api-js-services/model/CreateTextCommentInput';
import { ActivatedRoute } from '@angular/router';
import { App_activityPlanApi } from '../../abp-http/ut-api-js-services/api/App_activityPlanApi';
import { App_commentApi } from '../../abp-http/ut-api-js-services/api/App_commentApi';
import { CreateReplyInput } from '../../abp-http/ut-api-js-services/model/CreateReplyInput';
import { UserDto } from '../../abp-http/ut-api-js-services/model/UserDto';
import { App_userApi } from '../../abp-http/ut-api-js-services/api/App_userApi';
import { LocalStorageService } from 'ng2-webstorage';
import { App_replyApi } from '../../abp-http/ut-api-js-services/api/App_replyApi';
import { CommentDto } from '../../abp-http/ut-api-js-services/model/CommentDto';


@Component({
  selector: 'app-activity-plan',
  templateUrl: './activity-plan.component.html',
  styleUrls: ['./activity-plan.component.scss']
})
export class ActivityPlanComponent implements OnInit {

  public activityPlanId: string;
  public activityPlan: ActivityPlanDto;
  public createTextCommentInput: CreateTextCommentInput = {
    content: ''
  };
  public createReplyInput: CreateReplyInput = {
    content: ''
  };

  public user: UserDto;

  constructor(private route: ActivatedRoute,
              private activityPlanApi: App_activityPlanApi,
              private commentApi: App_commentApi,
              private localStorageService: LocalStorageService,
              private userApi: App_userApi,
              private replyApi: App_replyApi) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];

      this.activityPlanId = id;
      this.createTextCommentInput.activityPlanId = id;

      this.getActivityPlan();

      // this.getUser();
    });
  }

  private getActivityPlan() {
    this.createTextCommentInput.content = '';

    this.activityPlanApi
      .appActivityPlanGetActivityPlan({id: this.activityPlanId})
      .subscribe((output) => {
        this.activityPlan = output.activityPlan;
        console.log('Got activityPlan: ', this.activityPlan);
      });
  }

  public onClickCreateTextComment() {
    const createTextCommentSubscription = this.commentApi
      .appCommentCreateTextComment(this.createTextCommentInput)
      .subscribe(output => {
        this.getActivityPlan();

        createTextCommentSubscription.unsubscribe();
      });
  }

  public onClickCreateReply(comment: CommentDto) {
    this.createReplyInput.commentId = comment.id;

    const createTextCommentSubscription = this.replyApi
      .appReplyCreateReply(this.createReplyInput)
      .subscribe(output => {
        this.getActivityPlan();

        this.createReplyInput.commentId = null;

        createTextCommentSubscription.unsubscribe();
      });
  }

}


