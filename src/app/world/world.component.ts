import { Component, OnInit } from '@angular/core';

import { GetActivityPlansInput } from '../../abp-http/ut-api-js-services/model/GetActivityPlansInput';
import { ActivityPlanDto } from '../../abp-http/ut-api-js-services/model/ActivityPlanDto';
import { ActivityTemplateDto } from '../../abp-http/ut-api-js-services/model/activityTemplateDto';
import { App_activityPlanApi } from '../../abp-http/ut-api-js-services/api/App_activityPlanApi';
import {App_activityTemplateApi} from '../../abp-http/ut-api-js-services/api/App_activityTemplateApi';
import {GetActivityTemplatesInput} from '../../abp-http/ut-api-js-services/model/GetActivityTemplatesInput';
import {ActivityPlanListDto} from "../../abp-http/ut-api-js-services/model/ActivityPlanListDto";
import {ActivityTemplateListDto} from "../../abp-http/ut-api-js-services/model/ActivityTemplateListDto";


@Component({
  selector: 'app-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.scss']
})
export class WorldComponent implements OnInit {

  public isLoading = false;
  public isNoMoreResults = false;
  // public getActivityPlansInput: GetActivityPlansInput = {
  //   'queryKeywords': '',
  //   'userId': 0,
  //   'skipCount': 0
  // };
  // public getActivityTemplatesInput: GetActivityTemplatesInput = {
  //   'queryKeywords': '',
  //   'userId': 0,
  //   'skipCount': 0
  // };

  public activityPlans: ActivityPlanListDto[] = [];
  public activityTemplates: ActivityTemplateListDto[] = [];

  constructor(private activityPlanApi: App_activityPlanApi,
              private activityTemplateApi: App_activityTemplateApi) {
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
          this.isNoMoreResults = true;
        }

        for (let i = 0; i < output.activityPlans.length; i++) {
          this.activityPlans.push(output.activityPlans[i]);
        }

        this.isLoading = false;
      });

    // this.getActivityPlansInput.skipCount = this.getActivityPlansInput.skipCount + 10;

    this.activityTemplateApi
      .appActivityTemplateGetActivityTemplates({})
      .subscribe((output) => {
        if (output.activityTemplates.length === 0) {
          this.isNoMoreResults = true;
        }

        console.log('activity template:', output);

        for (let i = 0; i < output.activityTemplates.length; i++) {
          this.activityTemplates.push(output.activityTemplates[i]);
        }

        // console.log(this.)
        this.isLoading = false;
      });

    // this.getActivityTemplatesInput.skipCount = this.getActivityTemplatesInput.skipCount + 10;
  }

}
