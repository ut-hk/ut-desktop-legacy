import { Component, OnInit } from '@angular/core';
import {App_activityPlanApi} from "../../abp-http/ut-api-js-services/api/App_activityPlanApi";
import {ActivityPlanDto} from "../../abp-http/ut-api-js-services/model/ActivityPlanDto";

@Component({
  selector: 'app-activity-plan',
  templateUrl: './activity-plan.component.html',
  styleUrls: ['./activity-plan.component.scss']
})
export class ActivityPlanComponent implements OnInit {

  public activityPlan: ActivityPlanDto[];

  constructor(private activityPlanService: App_activityPlanApi) { }

  ngOnInit() {
    this.activityPlanService
      .appActivityPlanGetActivityPlans({})
      .subscribe((output) => {
        this.activityPlan = output.activityPlans;
        console.log(this.activityPlan);
      });
  }

}
