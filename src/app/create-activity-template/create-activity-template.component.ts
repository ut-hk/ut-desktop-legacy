import {Component, OnInit} from '@angular/core';

import {App_activityTemplateApi} from '../../abp-http/ut-api-js-services/api/App_activityTemplateApi';
import {CreateActivityTemplateInput} from '../../abp-http/ut-api-js-services/model/CreateActivityTemplateInput';

@Component({
  selector: 'app-create-activity-template',
  templateUrl: './create-activity-template.component.html',
  styleUrls: ['./create-activity-template.component.scss']
})
export class CreateActivityTemplateComponent implements OnInit {

  public createActivityTemplateInput: CreateActivityTemplateInput = {
    name: '123',
    description: '123',
    referenceTimeSlots: [],
    locationId: null
  };

  constructor(private activityTemplateService: App_activityTemplateApi) {
  }

  ngOnInit() {
  }

  public createActivityTemplate() {
    this.activityTemplateService
      .appActivityTemplateCreateActivityTemplate(this.createActivityTemplateInput)
      .subscribe((output) => {
        this.activityTemplateService
          .appActivityTemplateGetActivityTemplate({id: output.id})
          .subscribe((output2) => {

            console.log(output2);
          });
        console.log(output);
      });
  }

}
