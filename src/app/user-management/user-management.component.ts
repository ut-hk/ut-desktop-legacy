import {Component, OnInit} from '@angular/core';
import {App_relationshipApi} from '../../abp-http/ut-api-js-services/api/App_relationshipApi';
import {UserListDto} from '../../abp-http/ut-api-js-services/model/UserListDto';
import {ActivatedRoute} from '@angular/router';
import {LocalStorageService} from "ng2-webstorage";
import {UserDto} from "../../abp-http/ut-api-js-services/model/UserDto";


@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  public friends: UserListDto[];
  public admin : UserDto;

  constructor(private route: ActivatedRoute,
              private localStorageService: LocalStorageService,
              private relationshipApi: App_relationshipApi) {
  }

  ngOnInit() {
    this.admin = this.localStorageService.retrieve('myUser');
    this.route.params
      .subscribe(params => {

        const userId = this.admin.id;

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
  private onClickDeleteUser(userId: number) {

  }

}
