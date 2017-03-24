import { Component, OnInit } from '@angular/core';
import { CreateActivityPlanInput } from '../../abp-http/ut-api-js-services/model/CreateActivityPlanInput';
import { App_activityPlanApi } from '../../abp-http/ut-api-js-services/api/App_activityPlanApi';
import { App_activityTemplateApi } from '../../abp-http/ut-api-js-services/api/App_activityTemplateApi';
import { GetActivityTemplatesInput } from '../../abp-http/ut-api-js-services/model/GetActivityTemplatesInput';
import { ActivityTemplateDto } from '../../abp-http/ut-api-js-services/model/ActivityTemplateDto';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-create-activity-plan',
  templateUrl: './create-activity-plan.component.html',
  styleUrls: ['./create-activity-plan.component.scss']
})
export class CreateActivityPlanComponent implements OnInit {

  public createActivityPlanInput: CreateActivityPlanInput = {
    name: '',
  };

  public isLoading = false;
  public isNoMoreResults = false;
  public getActivityTemplatesInput: GetActivityTemplatesInput = {
    queryKeywords: '',
    maxResultCount: 10,
    skipCount: 0
  };
  public queryKeywordsControl = new FormControl();

  public activityTemplates: ActivityTemplateDto[] = [];
  public selectedActivityTemplates: ActivityTemplateDto[] = [];

  constructor(private activityPlanService: App_activityPlanApi,
              private activityTemplateService: App_activityTemplateApi) {
    this.queryKeywordsControl.valueChanges
      .debounceTime(700)
      .distinctUntilChanged()
      .subscribe(queryKeywords => {
        this.getActivityTemplatesInput.queryKeywords = queryKeywords;
        this.onQueryKeywordsChanged();
      });
  }

  ngOnInit() {
    this.getActivityTemplates();
  }

  public createActivityPlan() {
    this.activityPlanService
      .appActivityPlanCreateActivityPlan(this.createActivityPlanInput)
      .subscribe((output) => {

      });
  }

  public onScroll() {
    if (!this.isNoMoreResults) {
      this.getActivityTemplates();
    }
  }

  private onQueryKeywordsChanged() {
    this.isLoading = false;
    this.isNoMoreResults = false;
    this.getActivityTemplatesInput.skipCount = 0;
    this.activityTemplates = [];

    this.getActivityTemplates();
  }

  private getActivityTemplates() {
    if (!this.isLoading) {
      this.isLoading = true;

      this.activityTemplateService
        .appActivityTemplateGetActivityTemplates(this.getActivityTemplatesInput)
        .subscribe((output) => {
          if (output.activityTemplates.length === 0) {
            this.isNoMoreResults = true;
          }

          for (let i = 0; i < output.activityTemplates.length; i++) {
            this.activityTemplates.push(output.activityTemplates[i]);
          }

          this.isLoading = false;
        });

      this.getActivityTemplatesInput.skipCount = this.getActivityTemplatesInput.skipCount + 10;
    }
  }


}
