import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from "@angular/router";

import { LocalStorageModule } from "angular-2-local-storage";
import { CollapseModule } from "ng2-bootstrap";
import { AbpHttpModule } from "../abp-http/abp-http.module";

import { AppComponent } from './app.component';
import { WorldComponent } from './world/world.component';
import { LogInComponent } from './log-in/log-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ActivityTemplatesComponent } from './activity-templates/activity-templates.component';
import { ActivityPlanComponent } from './activity-plan/activity-plan.component';
import { FriendsComponent } from './friends/friends.component';
import { CreationOfActivityPlanComponent } from './creation-of-activity-plan/creation-of-activity-plan.component';
import { CreationOfActivityTemplateComponent } from './creation-of-activity-template/creation-of-activity-template.component';
import { CreationOfActivityComponent } from './creation-of-activity/creation-of-activity.component';
import { ChatRoomsComponent } from './chat-rooms/chat-rooms.component';
import { ActivityTemplateComponent } from './activity-template/activity-template.component';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const appRoutes: Routes = [
  {path: 'world', component: WorldComponent},

  {path: 'activity-plan/:id', component: ActivityPlanComponent},
  {path: 'activity-templates', component: ActivityTemplatesComponent},
  {path: 'activity-template/:id', component: ActivityTemplateComponent},

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
    CreationOfActivityPlanComponent,
    CreationOfActivityTemplateComponent,
    CreationOfActivityComponent,
    ChatRoomsComponent,
    ActivityTemplateComponent,
    AdvancedSearchComponent,
    UserProfileComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    LocalStorageModule.withConfig({
      prefix: 'ut',
      storageType: 'localStorage'
    }),
    AbpHttpModule,

    // Bootstrap
    CollapseModule.forRoot(),
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
