/**
 * Created by nelson on 10/3/17.
 */
import { Component, OnInit } from '@angular/core';

import { App_activityApi } from "../../abp-http/ut-api-js-services/api/App_activityApi";
import { ActivityDto } from "../../abp-http/ut-api-js-services/model/ActivityDto";

@Component({
  selector: 'app-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.scss']
})
export class ActivitiesComponent implements OnInit {

  public myActivities: ActivityDto[];

  constructor(private activityService: App_activityApi) {
  }

  ngOnInit() {
    this.activityService
      .appActivityGetMyActivities({})
      .subscribe((output) => {
        this.myActivities = output.myActivities;
        console.log(this.myActivities);
      });
  }

}
