import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {App_activityTemplateApi} from '../../abp-http/ut-api-js-services/api/App_activityTemplateApi';
import {ActivityTemplateDto} from '../../abp-http/ut-api-js-services/model/ActivityTemplateDto';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {CreateActivityTemplateInput, App_locationApi} from 'abp-http/ut-api-js-services';
import {NgUploaderOptions} from 'ngx-uploader';
import {App_descriptionApi} from '../../abp-http/ut-api-js-services/api/App_descriptionApi';
import {MapsAPILoader, MouseEvent} from '@agm/core';
import {DragulaService} from 'ng2-dragula';
import {TokenService} from '../../abp-http/http/token.service';
import {FileDto} from '../../abp-http/ut-api-js-services/model/FileDto';
import {CreateInternalImageDescriptionInput} from '../../abp-http/ut-api-js-services/model/CreateInternalImageDescriptionInput';
import {CreateTextDescriptionInput} from '../../abp-http/ut-api-js-services/model/CreateTextDescriptionInput';
import {DescriptionDto} from '../../abp-http/ut-api-js-services/model/DescriptionDto';
import {Observable} from 'rxjs';
import {UpdateActivityTemplateInput} from '../../abp-http/ut-api-js-services/model/UpdateActivityTemplateInput';
import {isNumber} from "util";


declare var google: any;

interface CreateDescriptionInput {
  input: (CreateTextDescriptionInput | CreateInternalImageDescriptionInput);

  type: DescriptionDto.TypeEnum;
}


@Component({
  selector: 'app-update-activity-template',
  templateUrl: './update-activity-template.component.html',
  styleUrls: ['./update-activity-template.component.scss']
})
export class UpdateActivityTemplateComponent implements OnInit {


  public activityTemplateId: string;
  public activityTemplate: ActivityTemplateDto;


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

  public updateActivityTemplateInput: UpdateActivityTemplateInput = {
    id: null,
    name: '',
    descriptionIds: [],
    referenceTimeSlots: [],
    locationId: '',
    tagTexts: []
  };

  public createDescriptionInputs: CreateDescriptionInput[] = [];


  constructor(private route: ActivatedRoute,
              private activityTemplateApi: App_activityTemplateApi,
              private locationApi: App_locationApi,
              private descriptionApi: App_descriptionApi,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              private router: Router,
              private dragulaService: DragulaService,
              private tokenService: TokenService) {
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
    this.route.params
      .subscribe(params => {
        const id = params['id'];

        this.activityTemplateId = id;
        this.updateActivityTemplateInput.id = id;


        this.getActivityTemplate();
      });

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

    this.updateActivityTemplateInput.referenceTimeSlots.push({
      startTime: currentTime,
      endTime: currentTime,
    });
  }

  public onClickRemoveTimeSlot(index) {
    if (index > -1) {
      this.updateActivityTemplateInput.referenceTimeSlots.splice(index, 1);
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


  private getActivityTemplate() {

    this.activityTemplateApi
      .appActivityTemplateGetActivityTemplate({id: this.activityTemplateId})
      .subscribe((output) => {
        this.activityTemplate = output.activityTemplate;
        this.injectData();
      });
  }

  private injectData() {
    this.updateActivityTemplateInput.name = this.activityTemplate.name;
    this.pageControls.tagTextsString = this.activityTemplate.tags.map(tag => {
      return tag.text;
    }).join(' ');
    for (let i = 0; i < this.activityTemplate.referenceTimeSlots.length; i++) {
      this.updateActivityTemplateInput.referenceTimeSlots.push({
        startTime: this.activityTemplate.referenceTimeSlots[i].startTime,
        endTime: this.activityTemplate.referenceTimeSlots[i].endTime,
      });
    }
    for (let i = 0; i < this.activityTemplate.descriptions.length; i++) {
      this.updateActivityTemplateInput.descriptionIds.push(this.activityTemplate.descriptions[i].id);
    }
    for (let i = 0; i < this.activityTemplate.descriptions.length; i++) {
      if (this.activityTemplate.descriptions[i].type == 0) {
        this.createDescriptionInputs.push({
          input: {
            text: this.activityTemplate.descriptions[i].content
          },
          type: 0
        });
      } else if (this.activityTemplate.descriptions[i].type == 1) {
        this.createDescriptionInputs.push({
          input: {
            imageId: this.activityTemplate.descriptions[i].content
          },
          type: 1
        });

      } else if (this.activityTemplate.descriptions[i].type == 2) {
        this.createDescriptionInputs.push({
          input: {
            imageId: this.activityTemplate.descriptions[i].content
          },
          type: 2
        });
      }
    }
    if (this.activityTemplate.location) {
      this.updateMarker(this.activityTemplate.location.latitude, this.activityTemplate.location.longitude, '');
    }
    if (this.activityTemplate.location.id) {
      this.updateActivityTemplateInput.locationId = this.activityTemplate.location.id;
    }
  }

  public onClickUpdate() {

    const tagTexts = this.pageControls.tagTextsString.match(/(#[a-z0-9][a-z0-9\-_]*)/ig);

    this.updateActivityTemplateInput.tagTexts = tagTexts ? tagTexts : [];
    const updateActivityTemplateSubscription = this.activityTemplateApi
      .appActivityTemplateUpdateActivityTemplate(this.updateActivityTemplateInput)
      .subscribe(updateoutput => {
        console.log(updateoutput);
      });

    console.log(this.updateActivityTemplateInput);


    this.router.navigate(['./activity-template/', this.activityTemplateId]);

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
