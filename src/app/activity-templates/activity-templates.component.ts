import { Component, OnInit } from '@angular/core';
import { App_activityTemplateApi } from '../../abp-http/ut-api-js-services/api/App_activityTemplateApi';
import { GetActivityTemplatesInput } from 'abp-http/ut-api-js-services';
import { FormControl } from '@angular/forms';
import { ActivityTemplateListDto } from '../../abp-http/ut-api-js-services/model/ActivityTemplateListDto';
import { App_ratingApi } from '../../abp-http/ut-api-js-services/api/App_ratingApi';
import { MouseEvent } from 'angular2-google-maps/core';

@Component({
  selector: 'app-activity-templates',
  templateUrl: './activity-templates.component.html',
  styleUrls: ['./activity-templates.component.scss']
})
export class ActivityTemplatesComponent implements OnInit {

  public pageControls = {
    isAdvancedSearchCollapsed: false,
    isLoading: false,
    isNoMoreResults: false,

    queryKeywordsControl: new FormControl()
  };

  public mapControls = {
    map: {
      lat: 22.4223236,
      lng: 114.20414459999999,
      zoom: 12
    },
    markers: []
  };

  public getActivityTemplatesInput: GetActivityTemplatesInput = {
    tagTexts: [],
    queryKeywords: '',
    startTime: null,
    endTime: null,
    latitude: null,
    longitude: null,
    userId: null,
    maxResultCount: 10,
    skipCount: 0
  };
  public activityTemplates: ActivityTemplateListDto[] = [];

  constructor(private activityTemplateApi: App_activityTemplateApi,
              private ratingApi: App_ratingApi) {
    this.pageControls
      .queryKeywordsControl.valueChanges
      .debounceTime(700)
      .distinctUntilChanged()
      .subscribe(queryKeywords => {
        this.getActivityTemplatesInput.queryKeywords = queryKeywords;
        this.onSearchConditionsChange();
      });
  }

  ngOnInit() {
    this.getActivityTemplates();
  }

  public onScroll() {
    if (!this.pageControls.isNoMoreResults) {
      this.getActivityTemplates();
    }
  }

  public onClickAdvanced() {
    this.pageControls.isAdvancedSearchCollapsed = !this.pageControls.isAdvancedSearchCollapsed;
  }

  public onClickMap($event: MouseEvent) {
    this.updateMarker($event.coords.lat, $event.coords.lng, '');
  }

  public onDateTimePickerChange() {
    this.onSearchConditionsChange();
  }

  public onClickResetStartTime() {
    if (this.getActivityTemplatesInput.startTime != null) {
      this.getActivityTemplatesInput.startTime = null;

      this.onDateTimePickerChange();
    }
  }

  public onClickResetEndTime() {
    if (this.getActivityTemplatesInput.endTime != null) {
      this.getActivityTemplatesInput.endTime = null;

      this.onDateTimePickerChange();
    }
  }

  public onClickLike(activityTemplate: ActivityTemplateListDto) {
    this.rate(activityTemplate, 0);
  }

  public onClickDislike(activityTemplate: ActivityTemplateListDto) {
    this.rate(activityTemplate, 1);
  }

  private rate(activityTemplate: ActivityTemplateListDto, ratingStatus: number) {
    const createRatingSubscription = this.ratingApi
      .appRatingCreateRating({ratingStatus: ratingStatus, activityTemplateId: activityTemplate.id})
      .subscribe(output => {
        activityTemplate.myRatingStatus = ratingStatus;

        switch (ratingStatus) {
          case 0:
            activityTemplate.likes = activityTemplate.likes + 1;
            break;
          case 1:
            activityTemplate.likes = activityTemplate.likes - 1;

            break;
        }

        createRatingSubscription.unsubscribe();
      });
  }

  private onSearchConditionsChange() {
    this.pageControls.isLoading = false;
    this.pageControls.isNoMoreResults = false;
    this.getActivityTemplatesInput.skipCount = 0;
    this.activityTemplates = [];

    this.getActivityTemplates();
  }

  private getActivityTemplates() {
    if (this.pageControls.isLoading) {
      return;
    }

    this.pageControls.isLoading = true;

    const getActivityTemplatesInputSubscription = this.activityTemplateApi
      .appActivityTemplateGetActivityTemplates(this.getActivityTemplatesInput)
      .subscribe((output) => {
        if (output.activityTemplates.length === 0) {
          this.pageControls.isNoMoreResults = true;
        }

        for (let i = 0; i < output.activityTemplates.length; i++) {
          this.activityTemplates.push(output.activityTemplates[i]);
        }

        this.getActivityTemplatesInput.skipCount = this.getActivityTemplatesInput.skipCount + 10;
        this.pageControls.isLoading = false;

        getActivityTemplatesInputSubscription.unsubscribe();
      });
  }

  private updateMarker(lat: number, lng: number, label: string) {
    this.mapControls.markers = [
      {
        lat: lat,
        lng: lng,

        label: label,
        draggable: false
      }
    ];

    this.mapControls.map.zoom = 13;
    this.mapControls.map.lat = lat;
    this.mapControls.map.lng = lng;

    this.getActivityTemplatesInput.latitude = lat;
    this.getActivityTemplatesInput.longitude = lng;

    this.onSearchConditionsChange();
  }

}
