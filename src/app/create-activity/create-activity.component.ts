import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { App_activityApi } from '../../abp-http/ut-api-js-services/api/App_activityApi';
import { CreateActivityInput } from '../../abp-http/ut-api-js-services/model/CreateActivityInput';
import { MouseEvent, MapsAPILoader } from 'angular2-google-maps/core';
import { FormControl } from '@angular/forms';
import { CreateTextDescriptionInput } from '../../abp-http/ut-api-js-services/model/CreateTextDescriptionInput';
import { NgUploaderOptions } from 'ngx-uploader';
import { Observable } from 'rxjs/Rx';
import { App_locationApi } from '../../abp-http/ut-api-js-services/api/App_locationApi';
import { App_descriptionApi } from '../../abp-http/ut-api-js-services/api/App_descriptionApi';

declare var google: any;

@Component({
  selector: 'app-create-activity',
  templateUrl: './create-activity.component.html',
  styleUrls: ['./create-activity.component.scss']
})
export class CreateActivityComponent implements OnInit {

  @ViewChild('locationNameElementRef')
  public locationNameElementRef: ElementRef;
  public locationNameControl: FormControl = new FormControl();

  public pageControls = {
    tagTextsModel: ''
  };

  public mapControls = {
    map: {
      lat: 22.4223236,
      lng: 114.20414459999999,
      zoom: 12
    },
    markers: []
  };

  public fileDropControls: { options?: NgUploaderOptions, isFileOver: boolean, response?: object } = {
    isFileOver: false
  };

  public createActivityInput: CreateActivityInput = {
    name: '',
    startTime: null,
    endTime: null,
    locationId: ''
  };
  public createTextDescriptionInputs: CreateTextDescriptionInput[] = [];

  constructor(private activityApi: App_activityApi,
              private descriptionApi: App_descriptionApi,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              private locationApi: App_locationApi) {
    this.fileDropControls.options = new NgUploaderOptions({
      url: 'http://api.ngx-uploader.com/upload',
      autoUpload: false
    });
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

  public onClickAddADescription() {
    this.createTextDescriptionInputs.push({
      text: ''
    });
  }

  public onClickDeleteADescription(index) {
    if (index > -1) {
      this.createTextDescriptionInputs.splice(index, 1);
    }
  }

  public onClickCreate() {
    this.createActivityInput.tagTexts = this.pageControls.tagTextsModel.match(/(#[a-z0-9][a-z0-9\-_]*)/ig);

    if (this.mapControls.markers.length > 0) {
      this.locationApi
        .appLocationCreateLocation({latitude: this.mapControls.markers[0].lat, longitude: this.mapControls.markers[0].lng})
        .map(output => {
          return output.id;
        })
        .flatMap(locationId => {
          this.createActivityInput.locationId = locationId;

          return this.activityApi
            .appActivityCreateActivity(this.createActivityInput)
            .map(createActivityOutput => {
              return createActivityOutput.id;
            });
        })
        .subscribe(activityId => {
          const createTextDescriptionObservables = this.createTextDescriptionInputs
            .map(input => {
              input.abstractActivityId = activityId;

              return this.descriptionApi.appDescriptionCreateTextDescription(input).map(output => output.id);
            });

          Observable.forkJoin(createTextDescriptionObservables)
            .subscribe(descriptionIds => {
              console.log(descriptionIds);
            });

        });
    } else {
      this.createActivity();
    }
  }

  private createActivity() {
    this.activityApi
      .appActivityCreateActivity(this.createActivityInput)
      .subscribe((output) => {
        console.log(output);
      });
  }

  public onFileUpload(data: any) {
    setTimeout(() => {
      this.ngZone.run(() => {
        this.fileDropControls.response = data;
        if (data && data.response) {
          this.fileDropControls.response = JSON.parse(data.response);
        }
      });
    });
  }

  public onFileOver(e: boolean) {
    this.fileDropControls.isFileOver = e;
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

}
