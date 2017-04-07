import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';

import { App_activityTemplateApi } from '../../abp-http/ut-api-js-services/api/App_activityTemplateApi';
import { CreateActivityTemplateInput } from '../../abp-http/ut-api-js-services/model/CreateActivityTemplateInput';
import { MouseEvent, MapsAPILoader } from 'angular2-google-maps/core';
import { FormControl } from '@angular/forms';
import { CreateTextDescriptionInput } from '../../abp-http/ut-api-js-services/model/CreateTextDescriptionInput';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../environments/environment';

declare var google: any;

@Component({
  selector: 'app-create-activity-template',
  templateUrl: './create-activity-template.component.html',
  styleUrls: ['./create-activity-template.component.scss']
})
export class CreateActivityTemplateComponent implements OnInit {

  @ViewChild('locationNameElementRef')
  public locationNameElementRef: ElementRef;
  public locationNameControl: FormControl = new FormControl();

  public mapControls = {
    map: {
      lat: 22.4223236,
      lng: 114.20414459999999,
      zoom: 12
    },
    markers: []
  };

  public uploadControls: { uploader: FileUploader, hasBaseDropZoneOver: boolean, hasAnotherDropZoneOver: boolean } = {
    uploader: new FileUploader({url: environment.baseUrl}),
    hasBaseDropZoneOver: false,
    hasAnotherDropZoneOver: false
  };

  public createActivityTemplateInput: CreateActivityTemplateInput = {
    name: '',
    referenceTimeSlots: [],
    locationId: ''
  };
  public createTextDescriptionInputs: CreateTextDescriptionInput[] = [];

  constructor(private activityTemplateApi: App_activityTemplateApi,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone) {
  }

  ngOnInit() {
    // set current position
    this.setCurrentPosition();

    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.locationNameElementRef.nativeElement, {
        types: ['address']
      });

      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.updateMarker(place.geometry.location.lat(), place.geometry.location.lng(), '');
        });
      });
    });
  }

  public onClickAddATimeSlot() {
    const currentTime = new Date();

    this.createActivityTemplateInput.referenceTimeSlots.push({
      startTime: currentTime,
      endTime: currentTime,
    });
  }

  public onClickAddADescription() {
    this.createTextDescriptionInputs.push({
      text: ''
    });
  }

  public onClickDeleteATimeSlot(index) {
    if (index > -1) {
      this.createActivityTemplateInput.referenceTimeSlots.splice(index, 1);
    }
  }

  public onClickDeleteADescription(index) {
    if (index > -1) {
      this.createTextDescriptionInputs.splice(index, 1);
    }
  }

  public createActivityTemplate() {
    this.upload();
    this.activityTemplateApi
      .appActivityTemplateCreateActivityTemplate(this.createActivityTemplateInput)
      .flatMap((output) => this.activityTemplateApi.appActivityTemplateGetActivityTemplate({id: output.id}))
      .subscribe((output) => {
        console.log(output);
      });
  }

  public onClickMap($event: MouseEvent) {
    this.updateMarker($event.coords.lat, $event.coords.lng, '');
  }

  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        // By current location
        this.updateMarker(position.coords.latitude, position.coords.longitude, '');
      }, () => {
        // Default value
        this.updateMarker(this.mapControls.map.lat, this.mapControls.map.lng, '');
      });
    }
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

    this.mapControls.map.lat = lat;
    this.mapControls.map.lng = lng;
    this.mapControls.map.zoom = 13;
  }

  public upload() {
    this.uploadControls.uploader.clearQueue();
  }

  public onFileOver(e: any): void {
    this.uploadControls.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.uploadControls.hasAnotherDropZoneOver = e;
  }


}
