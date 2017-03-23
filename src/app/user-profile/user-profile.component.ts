import { Component, OnInit } from '@angular/core';
import { ActivityDto } from '../../abp-http/ut-api-js-services/model/ActivityDto';
import { App_activityApi } from '../../abp-http/ut-api-js-services/api/App_activityApi';
import { UserDto } from '../../abp-http/ut-api-js-services/model/UserDto';
import { App_userApi } from '../../abp-http/ut-api-js-services/api/App_userApi';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  public myActivities: ActivityDto[];
  public myUser: UserDto;

  constructor(private activityService: App_activityApi,
              private userService: App_userApi) {
  }

  ngOnInit() {
    this.activityService
      .appActivityGetMyActivities({})
      .subscribe((output) => {
        this.myActivities = output.myActivities;
        console.log(this.myActivities);
      });

    this.userService
      .appUserGetMyUser()
      .subscribe((output) => {
        this.myUser = output.myUser;
      });
  }

}
