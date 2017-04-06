import { Component, OnInit } from '@angular/core';
import { App_activityTemplateApi } from '../../abp-http/ut-api-js-services/api/App_activityTemplateApi';
import { ActivityTemplateDto } from '../../abp-http/ut-api-js-services/model/ActivityTemplateDto';
import { GetActivityTemplatesInput } from 'abp-http/ut-api-js-services';
import { FormControl } from '@angular/forms';
import { ActivityTemplateListDto } from '../../abp-http/ut-api-js-services/model/ActivityTemplateListDto';
import { App_ratingApi } from '../../abp-http/ut-api-js-services/api/App_ratingApi';

@Component({
  selector: 'app-activity-templates',
  templateUrl: './activity-templates.component.html',
  styleUrls: ['./activity-templates.component.scss']
})
export class ActivityTemplatesComponent implements OnInit {

  public isLoading = false;
  public isNoMoreResults = false;
  public queryKeywordsControl = new FormControl();

  public getActivityTemplatesInput: GetActivityTemplatesInput = {
    tagTexts: [],
    queryKeywords: '',
    startTime: null,
    endTime: null,
    longitude: null,
    latitude: null,
    distance: null,
    userId: null,
    maxResultCount: 10,
    skipCount: 0
  };
  public activityTemplates: ActivityTemplateListDto[] = [];


  constructor(private activityTemplateService: App_activityTemplateApi,
              private ratingService: App_ratingApi) {
    this.queryKeywordsControl.valueChanges
      .debounceTime(700)
      .distinctUntilChanged()
      .subscribe(queryKeywords => {
        this.getActivityTemplatesInput.queryKeywords = queryKeywords;
        this.onConditionsChange();
      });
  }

  ngOnInit() {
    this.getActivityTemplates();
  }

  public onScroll() {
    if (!this.isNoMoreResults) {
      this.getActivityTemplates();
    }
  }

  public onDateTimePickerChange() {
    this.onConditionsChange();
  }

  public onClickLike(activityTemplate: ActivityTemplateListDto) {
    const ratingStatus = 0;

    const createRatingSubscription = this.ratingService
      .appRatingCreateRating({ratingStatus: ratingStatus, activityTemplateId: activityTemplate.id})
      .subscribe(output => {
        activityTemplate.myRatingStatus = ratingStatus;

        createRatingSubscription.unsubscribe();
      });
  }

  public onClickDislike(activityTemplate: ActivityTemplateListDto) {
    const ratingStatus = 1;

    const createRatingSubscription = this.ratingService
      .appRatingCreateRating({ratingStatus: ratingStatus, activityTemplateId: activityTemplate.id})
      .subscribe(output => {
        activityTemplate.myRatingStatus = ratingStatus;

        createRatingSubscription.unsubscribe();
      });
  }

  private onConditionsChange() {
    this.isLoading = false;
    this.isNoMoreResults = false;
    this.getActivityTemplatesInput.skipCount = 0;
    this.activityTemplates = [];

    this.getActivityTemplates();
  }

  private getActivityTemplates() {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    const getActivityTemplatesInputSubscription = this.activityTemplateService
      .appActivityTemplateGetActivityTemplates(this.getActivityTemplatesInput)
      .subscribe((output) => {
        if (output.activityTemplates.length === 0) {
          this.isNoMoreResults = true;
        }

        for (let i = 0; i < output.activityTemplates.length; i++) {
          this.activityTemplates.push(output.activityTemplates[i]);
        }

        this.getActivityTemplatesInput.skipCount = this.getActivityTemplatesInput.skipCount + 10;
        this.isLoading = false;

        getActivityTemplatesInputSubscription.unsubscribe();
      });

  }

}
