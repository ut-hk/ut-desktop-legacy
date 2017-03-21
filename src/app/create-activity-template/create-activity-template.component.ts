import {Component, OnInit} from '@angular/core';

import {App_activityTemplateApi} from '../../abp-http/ut-api-js-services/api/App_activityTemplateApi';
import {CreateActivityTemplateInput} from '../../abp-http/ut-api-js-services/model/CreateActivityTemplateInput';
import {NgModule, ApplicationRef} from '@angular/core';
import {MouseEvent} from 'angular2-google-maps/core';

@Component({
  selector: 'app-create-activity-template',
  templateUrl: './create-activity-template.component.html',
  styleUrls: ['./create-activity-template.component.scss']
})
export class CreateActivityTemplateComponent implements OnInit {

  // google maps zoom level
  zoom: number = 8;

  // initial center position for the map
  lat: number = 51.673858;
  lng: number = 7.815982;

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  mapClicked($event: MouseEvent) {

    this.markers = [
      {
      lat: $event.coords.lat,
      lng: $event.coords.lng,

      label: "WTF",
      draggable: true
    }];
    console.log(this.markers);
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }

  markers: marker[] = [
    {

      lat: 51.673858,
      lng: 7.815982,

      label: 'WTF',
      draggable: true
    }
  ]


  public createActivityTemplateInput: CreateActivityTemplateInput = {
    name: '123',
    referenceTimeSlots: [],
    locationId: ''
  };


  constructor(private activityTemplateService: App_activityTemplateApi) {
  }

  ngOnInit() {
  }

  public createActivityTemplate() {
    this.activityTemplateService
      .appActivityTemplateCreateActivityTemplate(this.createActivityTemplateInput)
      .subscribe((output) => {
        this.activityTemplateService
          .appActivityTemplateGetActivityTemplate({id: output.id})
          .subscribe((output2) => {

            console.log(output2);
          });
        console.log(output);
      });
  }

}

// just an interface for type safety.
interface marker {

  lat: number;
  lng: number;

  label ?: string;
  draggable: boolean;

}

