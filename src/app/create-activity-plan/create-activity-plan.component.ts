import { ChangeDetectionStrategy, Component, NgZone, OnInit } from '@angular/core';
import { CreateActivityPlanInput } from '../../abp-http/ut-api-js-services/model/CreateActivityPlanInput';
import { App_activityPlanApi } from '../../abp-http/ut-api-js-services/api/App_activityPlanApi';
import { App_activityTemplateApi } from '../../abp-http/ut-api-js-services/api/App_activityTemplateApi';
import { GetActivityTemplatesInput } from '../../abp-http/ut-api-js-services/model/GetActivityTemplatesInput';
import { ActivityTemplateDto } from '../../abp-http/ut-api-js-services/model/ActivityTemplateDto';
import { DragulaService } from 'ng2-dragula';
import { CreateTextDescriptionInput } from '../../abp-http/ut-api-js-services/model/CreateTextDescriptionInput';
import { NgUploaderOptions } from 'ngx-uploader';
import { CreateInternalImageDescriptionInput } from '../../abp-http/ut-api-js-services/model/CreateInternalImageDescriptionInput';
import { DescriptionDto } from '../../abp-http/ut-api-js-services/model/DescriptionDto';
import { TokenService } from '../../abp-http/http/token.service';
import { FileDto } from '../../abp-http/ut-api-js-services/model/FileDto';
import { FormControl } from '@angular/forms';
import { CalendarEvent } from 'angular-calendar/dist/esm/src';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

interface CreateDescriptionInput {
  input: (CreateTextDescriptionInput | CreateInternalImageDescriptionInput);

  type: DescriptionDto.TypeEnum;
}

interface ActivityTemplateEvent extends CalendarEvent {
  id: string;

  activityTemplate: ActivityTemplateDto;
}

@Component({
  selector: 'app-create-activity-plan',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './create-activity-plan.component.html',
  styleUrls: ['./create-activity-plan.component.scss']
})
export class CreateActivityPlanComponent implements OnInit {

  public pageControls = {
    tagTextsString: '',
    isLoading: false,
    isNoMoreResults: false,

    queryKeywordsControl: new FormControl()
  };

  public fileDropControls: { options?: NgUploaderOptions, isFileOver: boolean, response?: object } = {
    isFileOver: false
  };

  public createActivityPlanInput: CreateActivityPlanInput = {
    name: ''
  };

  public getActivityTemplatesInput: GetActivityTemplatesInput = {
    queryKeywords: '',
    maxResultCount: 10,
    skipCount: 0
  };

  public calendarControls: { viewDate: Date, events: ActivityTemplateEvent[] } = {
    viewDate: new Date(),
    events: []
  };

  public createDescriptionInputs: CreateDescriptionInput[] = [];

  public activityTemplates: ActivityTemplateDto[] = [];

  constructor(private dragulaService: DragulaService,
              private activityPlanService: App_activityPlanApi,
              private activityTemplateService: App_activityTemplateApi,
              private tokenService: TokenService,
              private ngZone: NgZone) {
    this.fileDropControls.options = new NgUploaderOptions({
      url: 'https://unitime-dev-api.azurewebsites.net/api/File/PostFile',
      autoUpload: true,
      authTokenPrefix: 'Bearer',
      authToken: tokenService.getToken()
    });
  }

  ngOnInit() {
    this.getActivityTemplates();
  }

  public onClickCreateActivityPlan() {
    // this.activityPlanService
    //   .appActivityPlanCreateActivityPlan(this.createActivityPlanInput)
    //   .subscribe((output) => {
    //
    //   });
  }

  public onClickAddTextDescription() {
    this.createDescriptionInputs.push({
      input: {
        text: ''
      },
      type: 0
    });
  }

  public onClickAddToPlan(activityTemplate: ActivityTemplateDto) {
    const event: ActivityTemplateEvent = {
      id: activityTemplate.id,
      title: activityTemplate.name,
      color: colors.red,
      start: addHours(startOfDay(new Date()), 2),
      activityTemplate: activityTemplate
    };

    console.log(this.calendarControls);
    this.calendarControls.events.push(event);
  }

  public onActivityTemplatesSelectorScroll() {
    if (!this.pageControls.isNoMoreResults) {
      this.getActivityTemplates();
    }
  }

  public onFileUpload(data: any) {
    setTimeout(() => {
      this.ngZone.run(() => {
        if (data && data.response) {
          const response = JSON.parse(data.response);

          const fileDtos: FileDto[] = response.result;

          let isPushed = false;
          for (let i = 0; i < fileDtos.length; i++) {
            const fileId = fileDtos[i].id;

            for (let j = 0; j < this.createDescriptionInputs.length; j++) {
              if (this.createDescriptionInputs[j].type === 2) {
                if ((<CreateInternalImageDescriptionInput> this.createDescriptionInputs[j].input).imageId === fileId) {
                  isPushed = true;
                  break;
                }
              }
            }

            if (isPushed) {
              break;
            }

            this.createDescriptionInputs.push({
              input: {
                imageId: fileDtos[i].id
              },
              type: 2
            });
          }
        }
      });
    });
  }

  public onFileOver(e: boolean) {
    this.fileDropControls.isFileOver = e;
  }

  private getActivityTemplates() {
    if (!this.pageControls.isLoading) {
      this.pageControls.isLoading = true;

      this.activityTemplateService
        .appActivityTemplateGetActivityTemplates(this.getActivityTemplatesInput)
        .subscribe((output) => {
          if (output.activityTemplates.length === 0) {
            this.pageControls.isNoMoreResults = true;
          }

          for (let i = 0; i < output.activityTemplates.length; i++) {
            this.activityTemplates.push(output.activityTemplates[i]);
          }

          this.pageControls.isLoading = false;
        });

      this.getActivityTemplatesInput.skipCount = this.getActivityTemplatesInput.skipCount + 10;
    }
  }

}
