import { Component, OnInit } from '@angular/core';
import { App_activityApi } from '../../abp-http/ut-api-js-services/api/App_activityApi';

@Component({
  selector: 'app-create-activity',
  templateUrl: './create-activity.component.html',
  styleUrls: ['./create-activity.component.scss']
})
export class CreateActivityComponent implements OnInit {

  constructor(private activityService: App_activityApi) { }

  ngOnInit() {
  }



}
