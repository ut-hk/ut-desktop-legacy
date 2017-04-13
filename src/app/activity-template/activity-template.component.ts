import {Component, OnInit} from '@angular/core';
import {App_activityTemplateApi} from '../../abp-http/ut-api-js-services/api/App_activityTemplateApi';
import {ActivityTemplateDto} from '../../abp-http/ut-api-js-services/model/ActivityTemplateDto';
import {ActivatedRoute, Router} from '@angular/router';
import {CreateTextCommentInput} from '../../abp-http/ut-api-js-services/model/CreateTextCommentInput';
import {App_commentApi} from '../../abp-http/ut-api-js-services/api/App_commentApi';
import {App_activityApi} from '../../abp-http/ut-api-js-services/api/App_activityApi';
import {CreateReplyInput} from '../../abp-http/ut-api-js-services/model/CreateReplyInput';
import {CommentDto} from '../../abp-http/ut-api-js-services/model/CommentDto';
import {App_replyApi} from '../../abp-http/ut-api-js-services/api/App_replyApi';
import {UserService} from '../user.service';
import {CreateActivityFromActivityTemplateInput} from '../../abp-http/ut-api-js-services/model/CreateActivityFromActivityTemplateInput';


@Component({
  selector: 'app-activity-template',
  templateUrl: './activity-template.component.html',
  styleUrls: ['./activity-template.component.scss']
})
export class ActivityTemplateComponent implements OnInit {

  public pageControls = {
    isMyActivityTemplate: false
  };

  public activityTemplateId: string;
  public activityTemplate: ActivityTemplateDto;

  public createTextCommentInput: CreateTextCommentInput = {
    content: ''
  };
  public createReplyInput: CreateReplyInput = {
    content: ''
  };
  public createActivityFromActivityPlanInput: CreateActivityFromActivityTemplateInput;

  constructor(private route: ActivatedRoute,
              private activityTemplateApi: App_activityTemplateApi,
              private activityApi: App_activityApi,
              private commentApi: App_commentApi,
              private replyApi: App_replyApi,
              private router: Router,
              private userService: UserService) {
    const currentDate = new Date();

    this.createActivityFromActivityPlanInput = {
      startTime: currentDate,
      endTime: currentDate
    };
  }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        const id = params['id'];

        this.activityTemplateId = id;

        this.createTextCommentInput.activityTemplateId = id;
        this.createActivityFromActivityPlanInput.activityTemplateId = id;

        this.getActivityTemplate();
      });
  }

  public onClickCreateTextComment() {
    const createTextCommentSubscription = this.commentApi
      .appCommentCreateTextComment(this.createTextCommentInput)
      .subscribe(output => {
        this.getActivityTemplate();

        this.createTextCommentInput.content = '';

        createTextCommentSubscription.unsubscribe();
      });
  }

  public onClickCreateReply(comment: CommentDto) {
    this.createReplyInput.commentId = comment.id;

    const createTextCommentSubscription = this.replyApi
      .appReplyCreateReply(this.createReplyInput)
      .subscribe(output => {
        this.getActivityTemplate();

        this.createReplyInput.commentId = null;
        this.createReplyInput.content = '';

        createTextCommentSubscription.unsubscribe();
      });
  }

  public onEdit() {
  }

  public onDelete() {
    this.activityTemplateApi
      .appActivityTemplateRemoveActivityTemplate({id: this.activityTemplateId})
      .subscribe(() => {
        this.router.navigate(['./world']);
      });
  }

  public onClickAddActivity() {
    const createActivityFromActivityTemplateSubscription = this.activityApi
      .appActivityCreateActivityFromActivityTemplate(this.createActivityFromActivityPlanInput)
      .subscribe(output => {
        alert('Created.');
        this.router.navigate(['./activity/', output.id]);
        createActivityFromActivityTemplateSubscription.unsubscribe();
      });
  }

  private getActivityTemplate() {
    this.createTextCommentInput.content = '';

    this.activityTemplateApi
      .appActivityTemplateGetActivityTemplate({id: this.activityTemplateId})
      .subscribe((output) => {
        const activityTemplate = output.activityTemplate;

        this.activityTemplate = activityTemplate;

        if (activityTemplate != null) {
          this.pageControls.isMyActivityTemplate = this.userService.checkIsMyUser(activityTemplate.owner.id);
        } else {
          alert('Activity doesn not exist.');
          this.router.navigate(['./**']);
        }

      });
  }

}
