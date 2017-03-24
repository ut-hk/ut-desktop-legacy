import { Component, OnInit } from '@angular/core';
import { App_userApi } from '../../abp-http/ut-api-js-services/api/App_userApi';
import { App_activityApi } from '../../abp-http/ut-api-js-services/api/App_activityApi';
import { UserDto } from '../../abp-http/ut-api-js-services/model/UserDto';
import { ActivityDto } from '../../abp-http/ut-api-js-services/model/ActivityDto';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

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
