import { Component, OnInit } from '@angular/core';
import { ActivityPlanDto } from '../../abp-http/ut-api-js-services/model/ActivityPlanDto';
import { CreateTextCommentInput } from '../../abp-http/ut-api-js-services/model/CreateTextCommentInput';
import { ActivatedRoute, Router } from '@angular/router';
import { App_activityPlanApi } from '../../abp-http/ut-api-js-services/api/App_activityPlanApi';
import { App_commentApi } from '../../abp-http/ut-api-js-services/api/App_commentApi';
import { CreateReplyInput } from '../../abp-http/ut-api-js-services/model/CreateReplyInput';
import { App_replyApi } from '../../abp-http/ut-api-js-services/api/App_replyApi';
import { CommentDto } from '../../abp-http/ut-api-js-services/model/CommentDto';
import { UserService } from '../user.service';


@Component({
  selector: 'app-activity-plan',
  templateUrl: './activity-plan.component.html',
  styleUrls: ['./activity-plan.component.scss']
})
export class ActivityPlanComponent implements OnInit {

  public pageControls = {
    isMyUser: false
  };

  public activityPlanId;
  public activityPlan: ActivityPlanDto;

  public createTextCommentInput: CreateTextCommentInput = {
    content: ''
  };
  public createReplyInput: CreateReplyInput = {
    content: ''
  };

  constructor(private route: ActivatedRoute,
              private activityPlanApi: App_activityPlanApi,
              private commentApi: App_commentApi,
              private replyApi: App_replyApi,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];

      this.activityPlanId = id;
      this.createTextCommentInput.activityPlanId = id;

      this.getActivityPlan();
    });
  }

  public onEdit() {
  }

  public onDelete() {
    this.activityPlanApi
      .appActivityPlanRemoveActivityPlan({id: this.activityPlanId})
      .subscribe(() => {
        this.router.navigate(['./world']);
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

  private getActivityPlan() {
    this.createTextCommentInput.content = '';

    const getActivityPlanSubscription = this.activityPlanApi
      .appActivityPlanGetActivityPlan({id: this.activityPlanId})
      .subscribe((output) => {
        const activityPlan = output.activityPlan;

        this.activityPlan = activityPlan;
        this.pageControls.isMyUser = this.userService.checkIsMyUser(activityPlan.owner.id);

        getActivityPlanSubscription.unsubscribe();
      });
  }

}


