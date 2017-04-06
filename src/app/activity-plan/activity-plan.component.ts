import { Component, OnInit } from '@angular/core';
import { ActivityPlanDto } from '../../abp-http/ut-api-js-services/model/ActivityPlanDto';
import { CreateTextCommentInput } from '../../abp-http/ut-api-js-services/model/CreateTextCommentInput';
import { ActivatedRoute } from '@angular/router';
import { App_activityPlanApi } from '../../abp-http/ut-api-js-services/api/App_activityPlanApi';
import { App_commentApi } from '../../abp-http/ut-api-js-services/api/App_commentApi';


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

  constructor(private route: ActivatedRoute,
              private activityPlanApi: App_activityPlanApi,
              private commentApi: App_commentApi) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];

      this.activityPlanId = id;
      this.createTextCommentInput.activityPlanId = id;

      this.getActivityPlan();
    });
  }

  public onClickTextComment() {
    this.commentApi
      .appCommentCreateTextComment(this.createTextCommentInput)
      .subscribe(output => {
        this.getActivityPlan();
      });
  }

  private getActivityPlan() {
    this.createTextCommentInput.content = '';

    this.activityPlanApi
      .appActivityPlanGetActivityPlan({id: this.activityPlanId})
      .subscribe((output) => {
        this.activityPlan = output.activityPlan;
      });
  }

}


