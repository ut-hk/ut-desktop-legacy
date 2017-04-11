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
import { TokenService } from '../../abp-http/http/token.service';
import { FileDto } from '../../abp-http/ut-api-js-services/model/FileDto';
import { CreateInternalImageDescriptionInput } from '../../abp-http/ut-api-js-services/model/CreateInternalImageDescriptionInput';
import { DescriptionDto } from '../../abp-http/ut-api-js-services/model/DescriptionDto';

declare var google: any;

interface CreateDescriptionInput {
  input: (CreateTextDescriptionInput | CreateInternalImageDescriptionInput);

  type: DescriptionDto.TypeEnum;
}

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
  public createDescriptionInputs: CreateDescriptionInput[] = [];

  constructor(private activityApi: App_activityApi,
              private descriptionApi: App_descriptionApi,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              private locationApi: App_locationApi,
              private tokenService: TokenService) {
    this.fileDropControls.options = new NgUploaderOptions({
      url: 'https://unitime-dev-api.azurewebsites.net/api/File/PostFile',
      autoUpload: true,
      authTokenPrefix: 'Bearer',
      authToken: tokenService.getToken()
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

  public onClickAddTextDescription() {
    this.createDescriptionInputs.push({
      input: {
        text: ''
      },
      type: 0
    });
  }

  public onClickDeleteDescription(index) {
    if (index > -1) {
      this.createDescriptionInputs.splice(index, 1);
    }
  }

  public onClickCreate() {
    Observable.empty().defaultIfEmpty()
      .flatMap(() => {
        if (this.mapControls.markers.length > 0) {
          return this.locationApi
            .appLocationCreateLocation({
              latitude: this.mapControls.markers[0].lat,
              longitude: this.mapControls.markers[0].lng})
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
        return this.createDescriptionInputs
          .map((createDescriptionInput, index) => {
            const input = createDescriptionInput.input;

            input.activityId = activityId;
            input.priority = index;

            if ((<CreateTextDescriptionInput> input).text) {
              return this.descriptionApi
                .appDescriptionCreateTextDescription(input)
                .map(output => output.id);
            } else if ((<CreateInternalImageDescriptionInput> input).imageId) {
              return this.descriptionApi
                .appDescriptionCreateInternalImageDescription(input)
                .map(output => output.id);
            }
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
        if (data && data.response) {
          const response = JSON.parse(data.response);

          const fileDtos: FileDto[] = response.result;

          let isPushed = false;
          for (let i = 0; i < fileDtos.length; i++) {
            const fileId = fileDtos[i].id;

            for (let j = 0; j < this.createDescriptionInputs.length; j++) {
              if (this.createDescriptionInputs[j].type === 2) {
                if ((<CreateInternalImageDescriptionInput> this.createDescriptionInputs[j].input).imageId === fileId) {
                  isPushed = true;
                  break;
                }
              }
            }

            if (isPushed) {
              break;
            }

            this.createDescriptionInputs.push({
              input: {
                imageId: fileDtos[i].id
              },
              type: 2
            });
          }
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
