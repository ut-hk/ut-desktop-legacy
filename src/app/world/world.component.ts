import { Component, OnInit } from '@angular/core';

import { GetActivityPlansInput } from '../../abp-http/ut-api-js-services/model/GetActivityPlansInput';
import { ActivityPlanDto } from '../../abp-http/ut-api-js-services/model/ActivityPlanDto';
import { App_activityPlanApi } from '../../abp-http/ut-api-js-services/api/App_activityPlanApi';



@Component({
  selector: 'app-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.scss']
})
export class WorldComponent implements OnInit {

  public isLoading = false;
  public isNoMoreResults = false;
  public getActivityPlansInput: GetActivityPlansInput = {
    'queryKeywords': '',
    'userId': 0,
    'skipCount': 0
  };

  public activityPlans: ActivityPlanDto[] = [];

  constructor(private activityPlanApi: App_activityPlanApi) {
  }

  ngOnInit() {
    this.getActivityPlans();
  }

  private getActivityPlans() {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    this.activityPlanApi
      .appActivityPlanGetActivityPlans({})
      .subscribe((output) => {
        if (output.activityPlans.length === 0) {
          this.isNoMoreResults = true;
        }

        for (let i = 0; i < output.activityPlans.length; i++) {
          this.activityPlans.push(output.activityPlans[i]);
        }

        this.isLoading = false;
      });

    this.getActivityPlansInput.skipCount = this.getActivityPlansInput.skipCount + 10;

  }

}
