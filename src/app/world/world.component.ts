import { Component, OnInit } from '@angular/core';

import { App_categoryApi } from "../../abp-http/ut-api-js-services/api/App_categoryApi";

@Component({
  selector: 'app-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.scss']
})
export class WorldComponent implements OnInit {

  constructor(private categoryService: App_categoryApi) {
  }

  ngOnInit() {
  }

  public onClickLearnMore() {
    this.categoryService.appCategoryGetCategories({})
      .subscribe((project) => {
        console.log(1);
        console.log(project);
      });
  }

}
