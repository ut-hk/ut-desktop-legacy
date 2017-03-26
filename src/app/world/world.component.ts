import { Component, OnInit } from '@angular/core';

import { App_activityPlanApi } from '../../abp-http/ut-api-js-services/api/App_activityPlanApi';
import { ActivityPlanDto } from '../../abp-http/ut-api-js-services/model/ActivityPlanDto';
import { GetActivityPlansInput } from '../../abp-http/ut-api-js-services/model/GetActivityPlansInput';

@Component({
  selector: 'app-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.scss']
})
export class WorldComponent implements OnInit {

  public isLoading = false;
  public isNoMoreResults = false;
  public getActivityPlansInput: GetActivityPlansInput = {
    queryKeywords: '',
    maxResultCount: 10,
    skipCount: 0
  };

  public activityPlans: ActivityPlanDto[] = [];

  constructor(private activityPlanService: App_activityPlanApi) {
  }

  ngOnInit() {
    this.getActivityPlans();
  }

  private getActivityPlans() {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    this.activityPlanService
      .appActivityPlanGetActivityPlans({})
      .subscribe((output) => {
        if (output.activityPlans.length === 0) {
          this.isNoMoreResults = true;
        }

        for (let i = 0; i < output.activityPlans.length; i++) {
          this.activityPlans.push(output.activityPlans[i]);
        }

        this.isLoading = false;

        console.log(this.activityPlans);
      });

    this.getActivityPlansInput.skipCount = this.getActivityPlansInput.skipCount + 10;

  }

}
