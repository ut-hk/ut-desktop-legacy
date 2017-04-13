import { Component, OnInit } from '@angular/core';
import { App_activityPlanApi } from '../../abp-http/ut-api-js-services/api/App_activityPlanApi';
import { App_activityTemplateApi } from '../../abp-http/ut-api-js-services/api/App_activityTemplateApi';
import { ActivityPlanListDto } from '../../abp-http/ut-api-js-services/model/ActivityPlanListDto';
import { ActivityTemplateListDto } from '../../abp-http/ut-api-js-services/model/ActivityTemplateListDto';
import { App_ratingApi } from '../../abp-http/ut-api-js-services/api/App_ratingApi';


@Component({
  selector: 'app-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.scss']
})
export class WorldComponent implements OnInit {

  public isLoading = false;
  public isNoMoreResults = false;

  public activityPlans: ActivityPlanListDto[] = [];
  public activityTemplates: ActivityTemplateListDto[] = [];

  constructor(private activityPlanApi: App_activityPlanApi,
              private activityTemplateApi: App_activityTemplateApi,
              private ratingApi: App_ratingApi) {
  }

  ngOnInit() {
    this.getActivityPlansAndTemplates();
  }

  private getActivityPlansAndTemplates() {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    this.activityPlanApi
      .appActivityPlanGetActivityPlans({})
      .subscribe((output) => {
        if (output.activityPlans.length === 0) {
        }

        for (let i = 0; i < output.activityPlans.length; i++) {
          this.activityPlans.push(output.activityPlans[i]);
        }
      });

    this.activityTemplateApi
      .appActivityTemplateGetActivityTemplates({})
      .subscribe((output) => {
        if (output.activityTemplates.length === 0) {
          this.isNoMoreResults = true;
        }

        for (let i = 0; i < output.activityTemplates.length; i++) {
          this.activityTemplates.push(output.activityTemplates[i]);
        }
        this.isLoading = false;
      });

  }

  public onClickLike(activityPlan: ActivityPlanListDto) {
    this.rate(activityPlan, 0);
  }

  public onClickDislike(activityPlan: ActivityPlanListDto) {
    this.rate(activityPlan, 1);
  }

  private rate(activityPlan: ActivityPlanListDto, ratingStatus: number) {
    const createRatingSubscription = this.ratingApi
      .appRatingCreateRating({ratingStatus: ratingStatus, activityPlanId: activityPlan.id})
      .subscribe(output => {
        activityPlan.myRatingStatus = ratingStatus;

        switch (ratingStatus) {
          case 0:
            activityPlan.likes = activityPlan.likes + 1;
            break;
          case 1:
            activityPlan.likes = activityPlan.likes - 1;
            break;
        }

        createRatingSubscription.unsubscribe();
      });
  }

}

