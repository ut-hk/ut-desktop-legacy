import {Component, OnInit, NgZone, ViewChild, ElementRef} from '@angular/core';

import {App_activityTemplateApi} from '../../abp-http/ut-api-js-services/api/App_activityTemplateApi';
import {CreateActivityTemplateInput} from '../../abp-http/ut-api-js-services/model/CreateActivityTemplateInput';
import {MouseEvent, MapsAPILoader, LatLng} from 'angular2-google-maps/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';


declare var google: any;

@Component({
  selector: 'app-create-activity-template',
  templateUrl: './create-activity-template.component.html',
  styleUrls: ['./create-activity-template.component.scss'],
})
export class CreateActivityTemplateComponent implements OnInit {


  @ViewChild("search")
  public searchElementRef: ElementRef;
  // initial center position for the map
  public lat: number;

  public lng: number;

  public searchControl: FormControl;

  // google maps zoom level
  public zoom: number;

  private map: google.maps.Map;

  constructor(private activityTemplateService: App_activityTemplateApi,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone) {
  }

  public currLocation: LatLng;

  markers: Marker[] = [
    {
      lat: 22.4223236,
      lng: 114.20414459999999,
      label: '',
      draggable: true
    }
  ];

  public createActivityTemplateInput: CreateActivityTemplateInput = {
    name: '',
    referenceTimeSlots: [],
    locationId: ''
  };

  ngOnInit() {
    this.zoom = 2;
    this.lat = 22.4223236;
    this.lng = 114.20414459999999;
    this.searchControl = new FormControl();


    //set current position
    this.setCurrentPosition();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });

      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set lat, lng and zoom
          this.markers = [
            {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              label: '',
              draggable: true
            }];
          console.log(place.geometry.location);
          console.log(this.markers);
          this.zoom = 12;
        });
      });
    });

  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {

        this.markers = [
          {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            label: '',
            draggable: true
          }];
        console.log(this.markers);
      });
    } else {
      this.markers = [
        {
          lat: 22.4223236,
          lng: 114.20414459999999,
          label: '',
          draggable: true
        }
      ];
      console.log("Default Location");
    }
    this.zoom = 12;

  }

  public createActivityTemplate() {
    this.activityTemplateService
      .appActivityTemplateCreateActivityTemplate(this.createActivityTemplateInput)
      .subscribe((output) => {
        this.activityTemplateService
          .appActivityTemplateGetActivityTemplate({id: output.id})
          .subscribe((output2) => {

            // console.log(output2);
          });
        // console.log(output);
      });
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
  }

  mapClicked($event: MouseEvent) {
    this.markers = [
      {
        lat: $event.coords.lat,
        lng: $event.coords.lng,

        label: '',
        draggable: true
      }];

    console.log(this.markers);
  }

  markerDragEnd(m: Marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }

  zoomIn(map) {
    map.setZoom(map.getZoom() + 1);
  }

  zoomOut(map) {
    map.setZoom(map.getZoom() - 1);
  }

}

// just an interface for type safety.
interface Marker {

  lat: number;
  lng: number;

  label ?: string;
  draggable: boolean;

}

