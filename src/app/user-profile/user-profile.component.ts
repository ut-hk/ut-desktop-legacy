import { Component, OnInit } from '@angular/core';
import {ActivityDto} from "../../abp-http/ut-api-js-services/model/ActivityDto";
import {App_activityApi} from "../../abp-http/ut-api-js-services/api/App_activityApi";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

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
