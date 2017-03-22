import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from "@angular/router";

import { LocalStorageModule } from "angular-2-local-storage";
import { CollapseModule } from "ng2-bootstrap";
import { AbpHttpModule } from "../abp-http/abp-http.module";

import { CommonModule } from '@angular/common';
import { AgmCoreModule } from 'angular2-google-maps/core';

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
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { CreateActivityPlanComponent } from './create-activity-plan/create-activity-plan.component';
import { CreateActivityComponent } from './create-activity/create-activity.component';
import { CreateActivityTemplateComponent } from './create-activity-template/create-activity-template.component';
import { UserComponent } from './user/user.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';

const appRoutes: Routes = [
  {path: 'world', component: WorldComponent},

  {path: 'activity-plan/:id', component: ActivityPlanComponent},
  {path: 'activity-templates', component: ActivityTemplatesComponent},
  {path: 'activity-template/:id', component: ActivityTemplateComponent},
  {path: 'create-activity-template', component: CreateActivityTemplateComponent},


  {path: 'user-profile', component: UserProfileComponent},

  {path: 'log-in', component: LogInComponent},
  {path: 'sign-up', component: SignUpComponent},

  {path: '', redirectTo: '/world', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  declarations: [
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
    AdvancedSearchComponent,
    CreateActivityPlanComponent,
    CreateActivityComponent,
    CreateActivityTemplateComponent,
    UserComponent,
    UpdateUserComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CommonModule,
    RouterModule.forRoot(appRoutes),
    LocalStorageModule.withConfig({
      prefix: 'ut',
      storageType: 'localStorage'
    }),
    AbpHttpModule,
    InfiniteScrollModule,

    // Bootstrap
    CollapseModule.forRoot(),

    // Angular Map
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBWXu4fJp8B_LF0jOD1-saNJDb4HJx7wHE'
    })
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}

