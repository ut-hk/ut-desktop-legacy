import { Component, OnInit } from '@angular/core';
import { App_activityPlanApi } from "../../abp-http/ut-api-js-services/api/App_activityPlanApi";
import { ActivityPlanDto } from "../../abp-http/ut-api-js-services/model/ActivityPlanDto";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-activity-plan',
  templateUrl: './activity-plan.component.html',
  styleUrls: ['./activity-plan.component.scss']
})
export class ActivityPlanComponent implements OnInit {

  public activityPlan: ActivityPlanDto;

  constructor(private route: ActivatedRoute, private activityPlanService: App_activityPlanApi) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params['id'];

      this.activityPlanService
        .appActivityPlanGetActivityPlan({id: id})
        .subscribe((output) => {
          this.activityPlan = output.activityPlan;
        });
    });


  }

}
