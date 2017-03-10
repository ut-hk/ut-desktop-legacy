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
import { ActivityPlansComponent } from './activity-plans/activity-plans.component';
import { ActivityTemplatesComponent } from './activity-templates/activity-templates.component';
import { MyUserComponent } from './my-user/my-user.component';

const appRoutes: Routes = [
  {path: 'world', component: WorldComponent},

  {path: 'activity-plans', component: ActivityPlansComponent},
  {path: 'activity-templates', component: ActivityTemplatesComponent},

  {path: 'my-user', component: MyUserComponent},

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
    ActivityPlansComponent,
    ActivityTemplatesComponent,
    MyUserComponent
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
