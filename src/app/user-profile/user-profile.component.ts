import { Component, OnInit } from '@angular/core';
import {ActivityDto} from "../../abp-http/ut-api-js-services/model/ActivityDto";
import {App_activityApi} from "../../abp-http/ut-api-js-services/api/App_activityApi";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  public myActivities: ActivityDto[];

  constructor(private activityService: App_activityApi) {
  }

  ngOnInit() {
    this.activityService
      .appActivityGetMyActivities({})
      .subscribe((output) => {
        this.myActivities = output.myActivities;
        console.log(this.myActivities);
      });
  }

}

// function isElementInViewport(el) {
//   var rect = el.getBoundingClientRect();
//   return (
//     rect.top >= 0 &&
//     rect.left >= 0 &&
//     rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
//     rect.right <= (window.innerWidth || document.documentElement.clientWidth)
//   );
// }
//
// var items = document.querySelectorAll(".timeline li");
//
// // code for the isElementInViewport function
//
// function callbackFunc() {
//   for (var i = 0; i < items.length; i++) {
//     if (isElementInViewport(items[i])) {
//       items[i].classList.add("in-view");
//     }
//   }
// }
//
// window.addEventListener("load", callbackFunc);
// window.addEventListener("scroll", callbackFunc);
