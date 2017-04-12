import { Component, OnInit } from '@angular/core';
import { App_relationshipApi } from '../../abp-http/ut-api-js-services/api/App_relationshipApi';
import { UserListDto } from '../../abp-http/ut-api-js-services/model/UserListDto';
import { App_managementApi } from '../../abp-http/ut-api-js-services/api/App_managementApi';


@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  public users: UserListDto[];

  constructor(private managementApi: App_managementApi) {
  }

  ngOnInit() {
    const a = this.managementApi
      .appManagementGetAllUsers({})
      .subscribe(output => {
        this.users = output.users;

        a.unsubscribe();
      });
  }

}
