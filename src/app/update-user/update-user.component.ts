import { Component, OnInit } from '@angular/core';
import { App_userApi } from '../../abp-http/ut-api-js-services/api/App_userApi';
import { UserDto } from '../../abp-http/ut-api-js-services/model/UserDto';
import { UpdateMyUserInput } from '../../abp-http/ut-api-js-services/model/UpdateMyUserInput';
import { UpdateMyUserPasswordInput } from '../../abp-http/ut-api-js-services/model/UpdateMyUserPasswordInput';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {

  public alerts: { type: string, message: string }[] = [];

  public updateMyUserInput: UpdateMyUserInput;
  public updateMyUserPasswordInput: UpdateMyUserPasswordInput = {
    oldPassword: '',
    newPassword: ''
  };

  constructor(private userService: App_userApi) {
  }

  ngOnInit() {
    const getMyUserSubscription = this.userService
      .appUserGetMyUser()
      .subscribe(output => {
        const myUser = output.myUser;

        this.updateMyUserInput = {
          name: myUser.name,
          surname: myUser.surname,
          phoneNumber: '',
          gender: myUser.gender,
          birthday: myUser.birthday,
          coverId: myUser.coverId
        };
      });
  }

  public updateMyUser() {
    const updateMyUserSubscription = this.userService
      .appUserUpdateMyUser(this.updateMyUserInput)
      .subscribe(output => {
        this.alerts.push({
          type: 'success',
          message: 'Successfully updated profile.'
        });

        updateMyUserSubscription.unsubscribe();
      });
  }

  public updateMyUserPassword() {
    const updateMyUserPasswordSubscription = this.userService
      .appUserUpdateMyUserPassword(this.updateMyUserPasswordInput)
      .subscribe(output => {
        this.alerts.push({
          type: 'success',
          message: 'Successfully updated password.'
        });

        updateMyUserPasswordSubscription.unsubscribe();
      });
  }

}
