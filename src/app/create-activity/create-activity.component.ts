import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { App_activityApi } from '../../abp-http/ut-api-js-services/api/App_activityApi';
import { CreateActivityInput } from '../../abp-http/ut-api-js-services/model/CreateActivityInput';
import { MapsAPILoader, MouseEvent } from 'angular2-google-maps/core';
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
    tagTextsString: ''
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
    locationId: '',
    tagTexts: []
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
    Observable.empty().defaultIfEmpty()
      .flatMap(() => {
        if (this.mapControls.markers.length > 0) {
          return this.locationApi
            .appLocationCreateLocation({latitude: this.mapControls.markers[0].lat, longitude: this.mapControls.markers[0].lng})
            .map(output => {
              return output.id;
            });
        }

        return Observable.empty();
      })
      .defaultIfEmpty<string>(null)
      .flatMap(locationId => {
        const tagTexts = this.pageControls.tagTextsString.match(/(#[a-z0-9][a-z0-9\-_]*)/ig);

        this.createActivityInput.tagTexts = tagTexts ? tagTexts : [];
        this.createActivityInput.locationId = locationId;

        return this.activityApi
          .appActivityCreateActivity(this.createActivityInput)
          .map(createActivityOutput => {
            return createActivityOutput.id;
          });
      })
      .flatMap(activityId => {
        return this.createTextDescriptionInputs
          .map((input, index) => {
            input.activityId = activityId;
            input.priority = index;

            return this.descriptionApi
              .appDescriptionCreateTextDescription(input)
              .map(output => output.id);
          });
      })
      .flatMap(observables => {
        return Observable.forkJoin(observables);
      })
      .subscribe(descriptionIds => {
        console.log(descriptionIds);
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
