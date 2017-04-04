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
    queryKeywords: '',
    maxResultCount: 10,
    skipCount: 0
  };

  public activityTemplates: ActivityTemplateListDto[] = [];

  private isAlive = true;

  constructor(private activityTemplateService: App_activityTemplateApi,
              private ratingService: App_ratingApi) {
    this.queryKeywordsControl.valueChanges
      .debounceTime(700)
      .distinctUntilChanged()
      .takeWhile(() => this.isAlive)
      .subscribe(queryKeywords => {
        this.getActivityTemplatesInput.queryKeywords = queryKeywords;
        this.onQueryKeywordsChanged();
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

  public onClickLike(activityTemplate: ActivityTemplateListDto) {
    const createRatingSubscription = this.ratingService
      .appRatingCreateRating({ratingStatus: 0, activityTemplateId: activityTemplate.id})
      .subscribe(output => {
        createRatingSubscription.unsubscribe();
      });
  }

  public onClickDislike(activityTemplate: ActivityTemplateListDto) {
    const createRatingSubscription = this.ratingService
      .appRatingCreateRating({ratingStatus: 1, activityTemplateId: activityTemplate.id})
      .subscribe(output => {
        createRatingSubscription.unsubscribe();
      });
  }

  private onQueryKeywordsChanged() {
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

    this.activityTemplateService
      .appActivityTemplateGetActivityTemplates(this.getActivityTemplatesInput)
      .takeWhile(() => this.isAlive)
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
