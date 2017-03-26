import { Component, OnInit } from '@angular/core';
import { App_trackApi } from '../../abp-http/ut-api-js-services/api/App_trackApi';
import { LocalStorageService } from 'angular-2-local-storage';
import { UserDto } from '../../abp-http/ut-api-js-services/model/UserDto';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

  constructor(
    private localStorageService: LocalStorageService,
    private trackService: App_trackApi) {
  }

  ngOnInit() {
    this.trackService
      .appTrackGetFriends({
        targetUserId: this.localStorageService.get<UserDto>('myUser').id
      })
      .subscribe((output) => {

      });
  }

}
