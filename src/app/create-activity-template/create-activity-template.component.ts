import {Component, OnInit, NgZone, ViewChild, ElementRef, Directive} from '@angular/core';

import {App_activityTemplateApi} from '../../abp-http/ut-api-js-services/api/App_activityTemplateApi';
import {CreateActivityTemplateInput} from '../../abp-http/ut-api-js-services/model/CreateActivityTemplateInput';
import {MouseEvent, MapsAPILoader} from 'angular2-google-maps/core';
import {FormControl} from '@angular/forms';
import {CreateTextDescriptionInput} from '../../abp-http/ut-api-js-services/model/CreateTextDescriptionInput';
import {URL} from '../../environments/environment';


import {
  FileSelectDirective,
  FileDropDirective,
  FileUploader
} from 'ng2-file-upload';

declare var google: any;


// just an interface for type safety.
interface Marker {

  lat: number;
  lng: number;

  label ?: string;
  draggable: boolean;

}

@Component({
  selector: 'app-create-activity-template',
  templateUrl: './create-activity-template.component.html',
  styleUrls: ['./create-activity-template.component.scss']
})
export class CreateActivityTemplateComponent implements OnInit {

  @ViewChild('locationNameElement')
  public locationNameElement: ElementRef;
  public locationNameControl: FormControl = new FormControl();

  // initial center position for the map
  public map = {
    lat: 22.4223236,
    lng: 114.20414459999999,
    zoom: 12
  };
  public markers: Marker[] = [];

  public createActivityTemplateInput: CreateActivityTemplateInput = {
    name: '',
    referenceTimeSlots: [],
    locationId: ''
  };
  public createTextDescriptionInputs: CreateTextDescriptionInput[] = [];

  public uploader: FileUploader = new FileUploader({url: URL});
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  constructor(private activityTemplateService: App_activityTemplateApi,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone) {
  }

  ngOnInit() {
    // set current position
    this.setCurrentPosition();

    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.locationNameElement.nativeElement, {
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
    this.activityTemplateService
      .appActivityTemplateCreateActivityTemplate(this.createActivityTemplateInput)
      .flatMap((output) => this.activityTemplateService.appActivityTemplateGetActivityTemplate({id: output.id}))
      .subscribe((output) => {
        console.log(output);
      });
  }

  public onClickMap($event: MouseEvent) {
    this.updateMarker($event.coords.lat, $event.coords.lng, '');

  }

  public onClickMarker(label: string, index: number) {
    console.log('Clicked the marker.');
  }

  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        // By current location
        this.updateMarker(position.coords.latitude, position.coords.longitude, '');
      }, () => {
        // Default value
        this.updateMarker(this.map.lat, this.map.lng, '');
      });
    }
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

    this.map.lat = lat;
    this.map.lng = lng;
    this.map.zoom = 13;
  }

  public upload() {
    console.log(this.uploader.uploadAll());
    this.uploader.clearQueue();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }


}
