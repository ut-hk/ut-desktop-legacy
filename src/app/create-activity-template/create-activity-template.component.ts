import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { App_activityTemplateApi } from '../../abp-http/ut-api-js-services/api/App_activityTemplateApi';
import { CreateActivityTemplateInput } from '../../abp-http/ut-api-js-services/model/CreateActivityTemplateInput';
import { FormControl } from '@angular/forms';
import { CreateTextDescriptionInput } from '../../abp-http/ut-api-js-services/model/CreateTextDescriptionInput';
import { NgUploaderOptions } from 'ngx-uploader';
import { DragulaService } from 'ng2-dragula';
import { Observable } from 'rxjs/Rx';
import { App_locationApi } from '../../abp-http/ut-api-js-services/api/App_locationApi';
import { App_descriptionApi } from '../../abp-http/ut-api-js-services/api/App_descriptionApi';
import { CreateInternalImageDescriptionInput } from '../../abp-http/ut-api-js-services/model/CreateInternalImageDescriptionInput';
import { FileDto } from '../../abp-http/ut-api-js-services/model/FileDto';
import { DescriptionDto } from 'abp-http/ut-api-js-services';
import { TokenService } from '../../abp-http/http/token.service';
import { Router } from '@angular/router';
import { MapsAPILoader, MouseEvent } from '@agm/core';


declare var google: any;

interface CreateDescriptionInput {
  input: (CreateTextDescriptionInput | CreateInternalImageDescriptionInput);

  type: DescriptionDto.TypeEnum;
}

@Component({
  selector: 'app-create-activity-template',
  templateUrl: './create-activity-template.component.html',
  styleUrls: ['./create-activity-template.component.scss']
})
export class CreateActivityTemplateComponent implements OnInit {

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

  public createActivityTemplateInput: CreateActivityTemplateInput = {
    name: '',
    referenceTimeSlots: [],
    locationId: '',
    tagTexts: []
  };

  public createDescriptionInputs: CreateDescriptionInput[] = [];

  constructor(private activityTemplateApi: App_activityTemplateApi,
              private locationApi: App_locationApi,
              private descriptionApi: App_descriptionApi,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              private dragulaService: DragulaService,
              private tokenService: TokenService,
              private router: Router) {
    this.fileDropControls.options = new NgUploaderOptions({
      url: 'https://unitime-dev-api.azurewebsites.net/api/File/PostFile',
      autoUpload: true,
      authTokenPrefix: 'Bearer',
      authToken: tokenService.getToken()
    });

    const bag: any = this.dragulaService.find('descriptions-bag');
    if (bag !== undefined) {
      this.dragulaService.destroy('descriptions-bag');
    }
    dragulaService.setOptions('descriptions-bag', {
      moves: function (el, container, handle) {
        return handle.className === 'glyphicon glyphicon-apple';
      }
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

  public onClickAddTimeSlot() {
    const currentTime = new Date();

    this.createActivityTemplateInput.referenceTimeSlots.push({
      startTime: currentTime,
      endTime: currentTime,
    });
  }

  public onClickRemoveTimeSlot(index) {
    if (index > -1) {
      this.createActivityTemplateInput.referenceTimeSlots.splice(index, 1);
    }
  }

  public onClickAddTextDescription() {
    this.createDescriptionInputs.push({
      input: {
        text: ''
      },
      type: 0
    });
  }

  public onClickRemoveDescription(index) {
    if (index > -1) {
      this.createDescriptionInputs.splice(index, 1);
    }
  }

  public onClickCreate() {
    let createdActivityId = null;

    Observable.empty().defaultIfEmpty()
      .flatMap(() => {
        if (this.mapControls.markers.length > 0) {
          return this.locationApi
            .appLocationCreateLocation({
              latitude: this.mapControls.markers[0].lat,
              longitude: this.mapControls.markers[0].lng
            })
            .map(output => {
              return output.id;
            });
        }

        return Observable.empty();
      })
      .defaultIfEmpty<string>(null)
      .flatMap(locationId => {
        const tagTexts = this.pageControls.tagTextsString.match(/(#[a-z0-9][a-z0-9\-_]*)/ig);

        this.createActivityTemplateInput.tagTexts = tagTexts ? tagTexts : [];
        this.createActivityTemplateInput.locationId = locationId;

        return this.activityTemplateApi
          .appActivityTemplateCreateActivityTemplate(this.createActivityTemplateInput)
          .map(createActivityOutput => {
            createdActivityId = createActivityOutput.id;
            return createActivityOutput.id;
          });
      })
      .flatMap(activityTemplateId => {
        return this.createDescriptionInputs
          .map((createDescriptionInput, index) => {
            const input = createDescriptionInput.input;

            input.activityTemplateId = activityTemplateId;
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
        this.router.navigate(['./activity-template/', createdActivityId]);
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
