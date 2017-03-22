import { Component, OnInit } from '@angular/core';
import { App_activityTemplateApi } from '../../abp-http/ut-api-js-services/api/App_activityTemplateApi';
import { ActivityTemplateDto } from '../../abp-http/ut-api-js-services/model/ActivityTemplateDto';

@Component({
  selector: 'app-activity-templates',
  templateUrl: './activity-templates.component.html',
  styleUrls: ['./activity-templates.component.scss']
})
export class ActivityTemplatesComponent implements OnInit {

  public activityTemplates: ActivityTemplateDto[] = [];
  private skipCount = 0;

  constructor(private activityTemplateService: App_activityTemplateApi) {
  }

  ngOnInit() {
    this.getActivityTemplates();
  }

  onScroll() {
    this.getActivityTemplates();
  }

  private getActivityTemplates() {
    this.activityTemplateService
      .appActivityTemplateGetActivityTemplates({
        maxResultCount: 10,
        skipCount: 0
      })
      .subscribe((output) => {
        for (let i = 0; i < output.activityTemplates.length; i++) {
          this.activityTemplates.push(output.activityTemplates[i]);
        }
      });

    this.skipCount = this.skipCount + 10;
  }

}
