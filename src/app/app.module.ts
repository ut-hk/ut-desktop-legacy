import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AbpHttpModule } from '../abp-http/abp-http.module';

import { Ng2Webstorage } from 'ng2-webstorage';
import { AlertModule, BsDropdownModule, CollapseModule, ModalModule, PopoverModule, TimepickerModule, TypeaheadModule } from 'ngx-bootstrap';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { DragulaModule } from 'ng2-dragula';
import { StickyModule } from 'ng2-sticky-kit/ng2-sticky-kit';
import { DateTimePickerModule } from 'ng-pick-datetime';
import { MomentModule } from 'angular2-moment';
import { NgUploaderModule } from 'ngx-uploader';
import { CalendarComponent } from 'angular2-fullcalendar/src/calendar/calendar';
import { CalendarModule } from 'angular-calendar';
import { DragAndDropModule } from 'angular-draggable-droppable';

import { TruncatePipe } from './truncate.pipe';
import { InternalImagePipe } from './internal-image.pipe';
import { GenderPipe } from './gender.pipe';

import { AppComponent } from './app.component';
import { WorldComponent } from './world/world.component';
import { LogInComponent } from './log-in/log-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ActivityTemplatesComponent } from './activity-templates/activity-templates.component';
import { ActivityPlanComponent } from './activity-plan/activity-plan.component';
import { FriendsComponent } from './friends/friends.component';
import { ChatRoomsComponent } from './chat-rooms/chat-rooms.component';
import { ActivityTemplateComponent } from './activity-template/activity-template.component';
import { CreateActivityPlanComponent } from './create-activity-plan/create-activity-plan.component';
import { CreateActivityComponent } from './create-activity/create-activity.component';
import { CreateActivityTemplateComponent } from './create-activity-template/create-activity-template.component';
import { UserComponent } from './user/user.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { SignUpProfileComponent } from './sign-up-profile/sign-up-profile.component';
import { FriendInvitationsComponent } from './friend-invitations/friend-invitations.component';
import { ActivityInvitationsComponent } from './activity-invitations/activity-invitations.component';
import { ActivityComponent } from './activity/activity.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const appRoutes: Routes = [
  {path: 'world', component: WorldComponent},
  {path: 'activity-plan/:id', component: ActivityPlanComponent},

  {path: 'activity-templates', component: ActivityTemplatesComponent},
  {path: 'activity-template/:id', component: ActivityTemplateComponent},


  {path: 'activity/:id', component: ActivityComponent},

  {path: 'create-activity-plan', component: CreateActivityPlanComponent},
  {path: 'create-activity-template', component: CreateActivityTemplateComponent},
  {path: 'create-activity', component: CreateActivityComponent},

  {path: 'activity-invitations', component: ActivityInvitationsComponent},

  {path: 'friend-invitations', component: FriendInvitationsComponent},
  {path: 'friends/:userId', component: FriendsComponent},

  {path: 'user/:id', component: UserComponent},
  {path: 'update-user', component: UpdateUserComponent},

  {path: 'log-in', component: LogInComponent},

  {path: 'sign-up', component: SignUpComponent},
  {path: 'sign-up-profile', component: SignUpProfileComponent},

  {path: 'chat-rooms', component: ChatRoomsComponent},

  {path: '', redirectTo: '/world', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  declarations: [
    TruncatePipe,
    GenderPipe,
    InternalImagePipe,

    AppComponent,
    WorldComponent,
    LogInComponent,
    SignUpComponent,
    PageNotFoundComponent,
    ActivityTemplatesComponent,
    ActivityPlanComponent,
    FriendsComponent,
    ChatRoomsComponent,
    ActivityTemplateComponent,
    CreateActivityPlanComponent,
    CreateActivityComponent,
    CreateActivityTemplateComponent,
    UserComponent,
    UpdateUserComponent,
    SignUpProfileComponent,
    FriendInvitationsComponent,
    ActivityInvitationsComponent,
    CalendarComponent,
    ActivityComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    CommonModule,
    RouterModule.forRoot(appRoutes),
    AbpHttpModule,

    Ng2Webstorage.forRoot({
      prefix: 'ut'
    }),
    NgUploaderModule,
    InfiniteScrollModule,
    DragulaModule,
    StickyModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBWXu4fJp8B_LF0jOD1-saNJDb4HJx7wHE',
      libraries: ['places']
    }),
    DateTimePickerModule,
    MomentModule,
    CalendarModule.forRoot(),
    DragAndDropModule,

    // Bootstrap
    CollapseModule.forRoot(),
    PopoverModule.forRoot(),
    TimepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    AlertModule.forRoot(),
    TypeaheadModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [
    GoogleMapsAPIWrapper
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}

