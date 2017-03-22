import {Component, OnInit} from '@angular/core';
import {CreateActivityPlanInput} from "../../abp-http/ut-api-js-services/model/CreateActivityPlanInput";
import {App_activityPlanApi} from "../../abp-http/ut-api-js-services/api/App_activityPlanApi";


@Component({
  selector: 'app-create-activity-plan',
  templateUrl: './create-activity-plan.component.html',
  styleUrls: ['./create-activity-plan.component.scss']
})
export class CreateActivityPlanComponent implements OnInit {

  public CreateActivityPlanInput: CreateActivityPlanInput = {
    name: "",
  };

  constructor(private activityPlanService: App_activityPlanApi) {

  }


  public create() {
    this.activityPlanService.appActivityPlanCreateActivityPlan(this.CreateActivityPlanInput).subscribe((output) => {output});
  }

  ngOnInit() {
  }

}
