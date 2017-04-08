import { Component, OnInit } from '@angular/core';
import { App_activityTemplateApi } from '../../abp-http/ut-api-js-services/api/App_activityTemplateApi';
import { ActivityTemplateDto } from '../../abp-http/ut-api-js-services/model/ActivityTemplateDto';
import { ActivatedRoute } from '@angular/router';
import { CreateTextCommentInput } from '../../abp-http/ut-api-js-services/model/CreateTextCommentInput';
import { App_commentApi } from '../../abp-http/ut-api-js-services/api/App_commentApi';
import { CreateActivityFromActivityTemplateInput } from '../../abp-http/ut-api-js-services/model/CreateActivityFromActivityTemplateInput';
import { App_activityApi } from '../../abp-http/ut-api-js-services/api/App_activityApi';

@Component({
  selector: 'app-activity-template',
  templateUrl: './activity-template.component.html',
  styleUrls: ['./activity-template.component.scss']
})
export class ActivityTemplateComponent implements OnInit {

  public activityTemplateId: string;
  public activityTemplate: ActivityTemplateDto;

  public createTextCommentInput: CreateTextCommentInput = {
    content: ''
  };

  public createActivityFromActivityPlanInput: CreateActivityFromActivityTemplateInput;

  constructor(private route: ActivatedRoute,
              private activityTemplateApi: App_activityTemplateApi,
              private activityApi: App_activityApi,
              private commentApi: App_commentApi) {
    const currentDate = new Date();

    this.createActivityFromActivityPlanInput = {
      startTime: currentDate,
      endTime: currentDate
    };
  }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        const id = params['id'];

        this.activityTemplateId = id;

        this.createTextCommentInput.activityTemplateId = id;
        this.createActivityFromActivityPlanInput.activityTemplateId = id;

        this.getActivityTemplate();
      });
  }

  public onClickCreateTextComment() {
    const createTextCommentSubscription = this.commentApi
      .appCommentCreateTextComment(this.createTextCommentInput)
      .subscribe(output => {
        this.getActivityTemplate();

        createTextCommentSubscription.unsubscribe();
      });
  }

  public onClickAddActivity() {
    const createActivityFromActivityTemplateSubscription = this.activityApi
      .appActivityCreateActivityFromActivityTemplate(this.createActivityFromActivityPlanInput)
      .subscribe(output => {
        alert('Created.');
        createActivityFromActivityTemplateSubscription.unsubscribe();
      });
  }

  private getActivityTemplate() {
    this.createTextCommentInput.content = '';

    this.activityTemplateApi
      .appActivityTemplateGetActivityTemplate({id: this.activityTemplateId})
      .subscribe((output) => {
        this.activityTemplate = output.activityTemplate;
      });
  }

}
