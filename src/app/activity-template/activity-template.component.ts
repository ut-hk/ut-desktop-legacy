import { Component, OnInit } from '@angular/core';
import { App_activityTemplateApi } from '../../abp-http/ut-api-js-services/api/App_activityTemplateApi';
import { ActivityTemplateDto } from '../../abp-http/ut-api-js-services/model/ActivityTemplateDto';
import { ActivatedRoute } from '@angular/router';
import { CreateTextCommentInput } from '../../abp-http/ut-api-js-services/model/CreateTextCommentInput';
import { App_commentApi } from '../../abp-http/ut-api-js-services/api/App_commentApi';

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

  constructor(private route: ActivatedRoute,
              private activityTemplateService: App_activityTemplateApi,
              private commentService: App_commentApi) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];

      this.activityTemplateId = id;
      this.createTextCommentInput.activityTemplateId = id;

      this.getActivityTemplate();
    });
  }

  public onClickAddToMyActivities() {

  }

  public onClickTextComment() {
    this.commentService
      .appCommentCreateTextComment(this.createTextCommentInput)
      .subscribe(output => {
        this.getActivityTemplate();
      });
  }

  private getActivityTemplate() {
    this.createTextCommentInput.content = '';

    this.activityTemplateService
      .appActivityTemplateGetActivityTemplate({id: this.activityTemplateId})
      .subscribe((output) => {
        this.activityTemplate = output.activityTemplate;
      });
  }

}
