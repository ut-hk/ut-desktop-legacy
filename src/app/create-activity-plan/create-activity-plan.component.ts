import { Component, NgZone, OnInit } from '@angular/core';
import { CreateActivityPlanInput } from '../../abp-http/ut-api-js-services/model/CreateActivityPlanInput';
import { App_activityPlanApi } from '../../abp-http/ut-api-js-services/api/App_activityPlanApi';
import { App_activityTemplateApi } from '../../abp-http/ut-api-js-services/api/App_activityTemplateApi';
import { GetActivityTemplatesInput } from '../../abp-http/ut-api-js-services/model/GetActivityTemplatesInput';
import { ActivityTemplateDto } from '../../abp-http/ut-api-js-services/model/ActivityTemplateDto';
import { CreateTextDescriptionInput } from '../../abp-http/ut-api-js-services/model/CreateTextDescriptionInput';
import { NgUploaderOptions } from 'ngx-uploader';
import { CreateInternalImageDescriptionInput } from '../../abp-http/ut-api-js-services/model/CreateInternalImageDescriptionInput';
import { DescriptionDto } from '../../abp-http/ut-api-js-services/model/DescriptionDto';
import { TokenService } from '../../abp-http/http/token.service';
import { FileDto } from '../../abp-http/ut-api-js-services/model/FileDto';
import { FormControl } from '@angular/forms';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar/dist/esm/src';
import { addDays, addHours, endOfDay, endOfMonth, isSameDay, isSameMonth, startOfDay, subDays } from 'date-fns';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { App_activityPlanTimeSlotApi } from '../../abp-http/ut-api-js-services/api/App_activityPlanTimeSlotApi';
import { App_descriptionApi } from '../../abp-http/ut-api-js-services/api/App_descriptionApi';


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
  templateUrl: './create-activity-plan.component.html',
  styleUrls: ['./create-activity-plan.component.scss']
})
export class CreateActivityPlanComponent implements OnInit {

  public pageControls = {
    tagTextsString: ''
  };

  public activityActivitySelectorControls = {
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

  public calendarControls: { viewDate: Date, events: ActivityTemplateEvent[], refresh: Subject<any> } = {
    viewDate: new Date(),
    events: [],
    refresh: new Subject()
  };

  public createDescriptionInputs: CreateDescriptionInput[] = [];

  public activityTemplates: ActivityTemplateDto[] = [];

  constructor(private activityPlanApi: App_activityPlanApi,
              private activityTemplateApi: App_activityTemplateApi,
              private activityPlanTimeSlotApi: App_activityPlanTimeSlotApi,
              private tokenService: TokenService,
              private descriptionApi: App_descriptionApi,
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
    let createdActivityPlanId = null;

    Observable.empty().defaultIfEmpty()
      .flatMap(() => {
        const tagTexts = this.pageControls.tagTextsString.match(/(#[a-z0-9][a-z0-9\-_]*)/ig);

        this.createActivityPlanInput.tagTexts = tagTexts ? tagTexts : [];

        return this.activityPlanApi
          .appActivityPlanCreateActivityPlan(this.createActivityPlanInput)
          .map(output => {
            createdActivityPlanId = output.id;

            return output.id;
          });
      })
      .flatMap(() => {
        const createActivityPlanTimeSlotInputs = this.calendarControls.events.map(event => {
          return {
            activityPlanId: createdActivityPlanId,
            activityTemplateId: event.activityTemplate.id,
            startTime: event.start,
            endTime: event.end
          };
        });

        const a = createActivityPlanTimeSlotInputs.map((createActivityPlanTimeSlotInput) => {
          return this.activityPlanTimeSlotApi
            .appActivityPlanTimeSlotCreateActivityPlanTimeSlot(createActivityPlanTimeSlotInput)
            .map(output => output.id);
        });

        return Observable.forkJoin(a);
      })
      .flatMap(() => {
        const a = this.createDescriptionInputs
          .map((createDescriptionInput, index) => {
            const input = createDescriptionInput.input;

            input.activityTemplateId = createdActivityPlanId;
            input.priority = index;

            if ((<CreateTextDescriptionInput> input).text) {
              return this.descriptionApi
                .appDescriptionCreateTextDescription(input)
                .map(output => output.id);
            } else if ((<CreateInternalImageDescriptionInput> input).imageId) {
              return this.descriptionApi
                .appDescriptionCreateInternalImageDescription(input)
                .map(output => output.id);
            }
          });

        return Observable.forkJoin(a);
      })
      .subscribe(() => {
        console.log(createdActivityPlanId);
      });

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
      start: addHours(startOfDay(new Date()), 1),
      end: addHours(startOfDay(new Date()), 2),
      activityTemplate: activityTemplate,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    };

    this.calendarControls.events.push(event);
    this.calendarControls.refresh.next();
  }

  public onEventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;

    this.calendarControls.refresh.next();
  }

  public onActivityTemplatesSelectorScroll() {
    console.log('S');
    if (!this.activityActivitySelectorControls.isNoMoreResults) {
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
    if (!this.activityActivitySelectorControls.isLoading) {
      this.activityActivitySelectorControls.isLoading = true;

      this.activityTemplateApi
        .appActivityTemplateGetActivityTemplates(this.getActivityTemplatesInput)
        .subscribe((output) => {
          if (output.activityTemplates.length === 0) {
            this.activityActivitySelectorControls.isNoMoreResults = true;
          }

          for (let i = 0; i < output.activityTemplates.length; i++) {
            this.activityTemplates.push(output.activityTemplates[i]);
          }

          this.activityActivitySelectorControls.isLoading = false;
        });

      this.getActivityTemplatesInput.skipCount = this.getActivityTemplatesInput.skipCount + 10;
    }
  }

}
