import { Component, OnInit } from '@angular/core';
import { App_userApi } from '../../abp-http/ut-api-js-services/api/App_userApi';
import { App_activityApi } from '../../abp-http/ut-api-js-services/api/App_activityApi';
import { UserDto } from '../../abp-http/ut-api-js-services/model/UserDto';
import { ActivityDto } from '../../abp-http/ut-api-js-services/model/ActivityDto';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public myActivities: ActivityDto[];
  public myUser: UserDto;
  id: number;
  private sub;

  private checkMyUser() {
    const storedMyUser = localStorage.getItem('myUser');
    let isMyUser: boolean;
    // console.log(this.id);
    // console.log(JSON.parse(storedMyUser).id);

    if (this.id === JSON.parse(storedMyUser).id) {
      isMyUser = true;
    } else {
      isMyUser = false;
    }
    console.log("isMyUser:" + isMyUser);
    return isMyUser;
  }

  constructor(private route: ActivatedRoute,
              private activityService: App_activityApi,
              private userService: App_userApi) {
  }

  ngOnInit() {
    this.userService
      .appUserGetMyUser()
      .subscribe((output) => {
        this.myUser = output.myUser;
        localStorage.setItem('myUser', JSON.stringify(this.myUser));
      });

    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });

    // this.checkMyUser();

    if (this.checkMyUser() === true) {
      this.activityService
        .appActivityGetMyActivities({})
        .subscribe((output) => {
          this.myActivities = output.myActivities;
          console.log(this.myActivities);
        });
    } else {
      // Get Another Users' Activities
    }


  }



}


