import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { UserDto } from '../../abp-http/ut-api-js-services/model/UserDto';
import { App_relationshipApi } from '../../abp-http/ut-api-js-services/api/App_relationshipApi';
import { UserListDto } from '../../abp-http/ut-api-js-services/model/UserListDto';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

  public friends: Array<UserListDto>;

  constructor(private route: ActivatedRoute,
              private localStorageService: LocalStorageService,
              private relationshipApi: App_relationshipApi) {
  }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        const userId = params['userId'];

        this.getFriends(userId);
      });
  }

  private getFriends(userId: number) {
    const getFriendsSubscription = this.relationshipApi
      .appRelationshipGetFriends({
        targetUserId: userId
      })
      .subscribe((output) => {
        this.friends = output.friends;

        getFriendsSubscription.unsubscribe();
      });
  }

}
