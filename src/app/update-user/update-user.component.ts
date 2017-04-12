import { Component, NgZone, OnInit } from '@angular/core';
import { App_userApi } from '../../abp-http/ut-api-js-services/api/App_userApi';
import { UpdateMyUserInput } from '../../abp-http/ut-api-js-services/model/UpdateMyUserInput';
import { UpdateMyUserPasswordInput } from '../../abp-http/ut-api-js-services/model/UpdateMyUserPasswordInput';
import { NgUploaderOptions } from 'ngx-uploader';
import { TokenService } from '../../abp-http/http/token.service';
import { environment } from '../../environments/environment';
import { FileDto } from '../../abp-http/ut-api-js-services/model/FileDto';

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

  public fileDropControls: { options?: NgUploaderOptions, isFileOver: boolean, response?: object } = {
    isFileOver: false
  };

  constructor(private userApi: App_userApi,
              private ngZone: NgZone,
              private tokenService: TokenService) {
    this.fileDropControls.options = new NgUploaderOptions({
      url: environment.baseUrl + '/api/File/PostFile',
      autoUpload: true,
      authTokenPrefix: 'Bearer',
      authToken: tokenService.getToken(),
      maxUploads: 1
    });
  }

  ngOnInit() {
    const getMyUserSubscription = this.userApi
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

        getMyUserSubscription.unsubscribe();
      });
  }

  public updateMyUser() {
    const updateMyUserSubscription = this.userApi
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
    const updateMyUserPasswordSubscription = this.userApi
      .appUserUpdateMyUserPassword(this.updateMyUserPasswordInput)
      .subscribe(output => {
        this.alerts.push({
          type: 'success',
          message: 'Successfully updated password.'
        });

        updateMyUserPasswordSubscription.unsubscribe();
      });
  }

  public onFileUpload(data: any) {
    setTimeout(() => {
      this.ngZone.run(() => {
        if (data && data.response) {
          const response = JSON.parse(data.response);

          const fileDtos: FileDto[] = response.result;

          if (fileDtos.length > 0) {
            this.updateMyUserInput.iconId = fileDtos[0].id;
          }
        }
      });
    });
  }

  public onFileOver(e: boolean) {
    this.fileDropControls.isFileOver = e;
  }

}
