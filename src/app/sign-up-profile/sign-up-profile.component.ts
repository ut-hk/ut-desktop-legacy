import { Component, OnInit } from '@angular/core';
import { App_userApi } from '../../abp-http/ut-api-js-services/api/App_userApi';
import { UpdateMyUserInput } from '../../abp-http/ut-api-js-services/model/UpdateMyUserInput';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'app-sign-up-profile',
  templateUrl: './sign-up-profile.component.html',
  styleUrls: ['./sign-up-profile.component.scss']
})
export class SignUpProfileComponent implements OnInit {

  public updateMyUserInput: UpdateMyUserInput;

  constructor(private userApi: App_userApi,
              private router: Router,
              private localStorageService: LocalStorageService) {
  }

  ngOnInit() {
    this.userApi
      .appUserGetMyUser()
      .subscribe(output => {
        const myUser = output.myUser;

        this.updateMyUserInput = {
          name: myUser.name,
          surname: myUser.surname,
          phoneNumber: '',
          gender: myUser.gender,
          birthday: myUser.birthday,
          iconId: myUser.iconId,
          coverId: myUser.coverId
        };
      });
  }

  public updateMyUser() {
    const updateMyUserSubscription = this.userApi
      .appUserUpdateMyUser(this.updateMyUserInput)
      .flatMap(output => {
        return this.userApi
          .appUserGetMyUser({});
      })
      .subscribe(output => {
        this.localStorageService.set('myUser', output.myUser);
        this.localStorageService.set('userGuestId', output.guestId);

        this.router.navigate(['./world']);

        updateMyUserSubscription.unsubscribe();
      });
  }

}
