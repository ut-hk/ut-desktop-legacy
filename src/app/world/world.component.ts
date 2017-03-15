import { Component, OnInit } from '@angular/core';

import { App_activityPlanApi } from "../../abp-http/ut-api-js-services/api/App_activityPlanApi";
import { ActivityPlanDto } from "../../abp-http/ut-api-js-services/model/ActivityPlanDto";

@Component({
  selector: 'app-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.scss']
})
export class WorldComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
