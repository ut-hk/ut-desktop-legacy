import { Component, OnInit } from '@angular/core';
import { App_activityTemplateApi } from "../../abp-http/ut-api-js-services/api/App_activityTemplateApi";
import { ActivityTemplateDto } from "../../abp-http/ut-api-js-services/model/ActivityTemplateDto";

@Component({
  selector: 'app-activity-templates',
  templateUrl: './activity-templates.component.html',
  styleUrls: ['./activity-templates.component.scss']
})
export class ActivityTemplatesComponent implements OnInit {

  public activityTemplates: ActivityTemplateDto[];

  constructor(private activityTemplateService: App_activityTemplateApi) {
  }

  ngOnInit() {
    this.activityTemplateService
      .appActivityTemplateGetActivityTemplates({})
      .subscribe((output) => {
        this.activityTemplates = output.activityTemplates;
        console.log(this.activityTemplates);
      });
  }

}
