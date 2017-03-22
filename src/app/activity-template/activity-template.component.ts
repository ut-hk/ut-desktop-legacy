import {Component, OnInit} from '@angular/core';
import {App_activityTemplateApi} from "../../abp-http/ut-api-js-services/api/App_activityTemplateApi";
import {ActivityTemplateDto} from "../../abp-http/ut-api-js-services/model/ActivityTemplateDto";
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-activity-template',
  templateUrl: './activity-template.component.html',
  styleUrls: ['./activity-template.component.scss']
})
export class ActivityTemplateComponent implements OnInit {

  public activityTemplate: ActivityTemplateDto;

  constructor(private route: ActivatedRoute, private activityTemplateService: App_activityTemplateApi) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      console.log(id);
      this.activityTemplateService
        .appActivityTemplateGetActivityTemplate({id: id})
        .subscribe((output) => {
          this.activityTemplate = output.activityTemplate;
          console.log(this.activityTemplate);
        });
    });
  }


}
