import {Component, OnInit} from '@angular/core';

import {App_activityPlanApi} from '../../abp-http/ut-api-js-services/api/App_activityPlanApi';
import {ActivityPlanDto} from '../../abp-http/ut-api-js-services/model/ActivityPlanDto';

@Component({
  selector: 'app-activity-plans',
  templateUrl: './activity-plans.component.html',
  styleUrls: ['./activity-plans.component.scss']
})
export class ActivityPlansComponent implements OnInit {

  public activityPlans: ActivityPlanDto[];

  constructor(private activityPlanService: App_activityPlanApi) {
  }

  ngOnInit() {
    this.activityPlanService
      .appActivityPlanGetActivityPlans({})
      .subscribe((output) => {
        this.activityPlans = output.activityPlans;
      });
  }
}


