import { Component, OnInit } from '@angular/core';
import { App_activityTemplateApi } from '../../abp-http/ut-api-js-services/api/App_activityTemplateApi';
import { GetActivityTemplatesInput } from 'abp-http/ut-api-js-services';
import { FormControl } from '@angular/forms';
import { ActivityTemplateListDto } from '../../abp-http/ut-api-js-services/model/ActivityTemplateListDto';
import { App_ratingApi } from '../../abp-http/ut-api-js-services/api/App_ratingApi';
import { MouseEvent, MapsAPILoader } from 'angular2-google-maps/core';

declare var google: any;

// just an interface for type safety.
interface Marker {

  lat: number;
  lng: number;

  label ?: string;
  draggable: boolean;

}

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
    latitude: null,
    longitude: null,
    userId: null,
    maxResultCount: 10,
    skipCount: 0
  };
  public activityTemplates: ActivityTemplateListDto[] = [];

  // initial center position for the map
  public map = {
    lat: 22.273131,
    lng: 114.187966,
    zoom: 12
  };
  public markers: Marker[] = [];

  constructor(private activityTemplateApi: App_activityTemplateApi,
              private ratingApi: App_ratingApi) {
    this.queryKeywordsControl.valueChanges
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
    if (!this.isNoMoreResults) {
      this.getActivityTemplates();
    }
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
    const ratingStatus = 0;

    const createRatingSubscription = this.ratingApi
      .appRatingCreateRating({ratingStatus: ratingStatus, activityTemplateId: activityTemplate.id})
      .subscribe(output => {
        activityTemplate.myRatingStatus = ratingStatus;

        createRatingSubscription.unsubscribe();
      });
  }

  public onClickDislike(activityTemplate: ActivityTemplateListDto) {
    const ratingStatus = 1;

    const createRatingSubscription = this.ratingApi
      .appRatingCreateRating({ratingStatus: ratingStatus, activityTemplateId: activityTemplate.id})
      .subscribe(output => {
        activityTemplate.myRatingStatus = ratingStatus;

        createRatingSubscription.unsubscribe();
      });
  }

  private onSearchConditionsChange() {
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

    const getActivityTemplatesInputSubscription = this.activityTemplateApi
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

  private updateMarker(lat: number, lng: number, label: string) {
    this.markers = [
      {
        lat: lat,
        lng: lng,

        label: label,
        draggable: false
      }
    ];

    this.getActivityTemplatesInput.latitude = lat;
    this.getActivityTemplatesInput.longitude = lng;

    this.map.zoom = 13;

    this.onSearchConditionsChange();
  }

}
