import {Component, ElementRef, OnInit, Renderer} from '@angular/core';
import {CreateActivityPlanInput} from '../../abp-http/ut-api-js-services/model/CreateActivityPlanInput';
import {App_activityPlanApi} from '../../abp-http/ut-api-js-services/api/App_activityPlanApi';
import {App_activityTemplateApi} from '../../abp-http/ut-api-js-services/api/App_activityTemplateApi';
import {GetActivityTemplatesInput} from '../../abp-http/ut-api-js-services/model/GetActivityTemplatesInput';
import {ActivityTemplateDto} from '../../abp-http/ut-api-js-services/model/ActivityTemplateDto';
import {FormControl} from '@angular/forms';
import {CreateActivityPlanTimeSlotInput} from '../../abp-http/ut-api-js-services/model/CreateActivityPlanTimeSlotInput';
import {DragulaService} from 'ng2-dragula';
import {CreateTextDescriptionInput} from '../../abp-http/ut-api-js-services/model/CreateTextDescriptionInput';
import {App_tagApi} from '../../abp-http/ut-api-js-services/api/App_tagApi';
import {TypeaheadMatch} from 'ngx-bootstrap/typeahead';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-create-activity-plan',
  templateUrl: './create-activity-plan.component.html',
  styleUrls: ['./create-activity-plan.component.scss']
})
export class CreateActivityPlanComponent implements OnInit {
  onChange: () => any;

  public createActivityPlanInput: CreateActivityPlanInput = {
    name: '',
  };

  public isLoading = false;
  public isNoMoreResults = false;
  public getActivityTemplatesInput: GetActivityTemplatesInput = {
    queryKeywords: '',
    maxResultCount: 10,
    skipCount: 0
  };
  public queryKeywordsControl = new FormControl();
  public queryTextControl = new FormControl();
  public tagInputBox = new FormControl();

  public activityTemplates: ActivityTemplateDto[] = [];
  public selectedActivityTemplates: {activityTemplate: ActivityTemplateDto[], timeSlot: {startTime: string, endTime: string}}[] = [];
  public createTextDescriptionInput: CreateTextDescriptionInput = {};

  public asyncSelected: string;
  public typeaheadLoading: boolean;
  public typeaheadNoResults: boolean;
  public dataSource: Observable<any>;
  public tagsComplex: any[] = [];

  constructor(private dragulaService: DragulaService,
              private activityPlanService: App_activityPlanApi,
              private activityTemplateService: App_activityTemplateApi,
              private tagService: App_tagApi) {
    this.queryKeywordsControl.valueChanges
      .debounceTime(700)
      .distinctUntilChanged()
      .subscribe(queryKeywords => {
        this.getActivityTemplatesInput.queryKeywords = queryKeywords;
        this.onQueryKeywordsChanged();
      });

    this.dataSource = Observable
      .create((observer: any) => {
        // Runs on every search
          observer.next(this.asyncSelected);
          console.log(this.asyncSelected);
      })
      .mergeMap((token: string) => this.getTagsAsObservable(token));

    dragulaService.drop.subscribe((value) => {
      console.log(value);
    });

    dragulaService.setOptions('bag-one', {
      revertOnSpill: true
    });
  }

  public getTagsAsObservable(token: string): Observable<any> {
    return this.getTags({queryText: token})
      .map((output) => {
        console.log(output.tags);
        return output.tags;
      });
  }

  ngOnInit() {
    this.getActivityTemplates();
  }

  public createActivityPlan() {
    // this.activityPlanService
    //   .appActivityPlanCreateActivityPlan(this.createActivityPlanInput)
    //   .subscribe((output) => {
    //
    //   });
  }

  public onScroll() {
    if (!this.isNoMoreResults) {
      this.getActivityTemplates();
    }
  }

  private onQueryKeywordsChanged() {
    this.isLoading = false;
    this.isNoMoreResults = false;
    this.getActivityTemplatesInput.skipCount = 0;
    this.activityTemplates = [];

    this.getActivityTemplates();
  }

  private getActivityTemplates() {
    if (!this.isLoading) {
      this.isLoading = true;

      this.activityTemplateService
        .appActivityTemplateGetActivityTemplates(this.getActivityTemplatesInput)
        .subscribe((output) => {
          if (output.activityTemplates.length === 0) {
            this.isNoMoreResults = true;
          }

          for (let i = 0; i < output.activityTemplates.length; i++) {
            this.activityTemplates.push(output.activityTemplates[i]);
          }

          this.isLoading = false;
        });

      this.getActivityTemplatesInput.skipCount = this.getActivityTemplatesInput.skipCount + 10;
    }
  }

  public changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  public onTypeaheadNoResults(e: boolean): void {
    this.typeaheadNoResults = e;
  }

  public typeaheadOnSelect(e: TypeaheadMatch): void {
    console.log('Selected value: ', e.value);
  }

  public getTags(getTagsInput): Observable<any> {
    return this.tagService
      .appTagGetTags(getTagsInput);
  }

}
