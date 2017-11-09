import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';

import {UserService} from './shared/services/user.service';
import {AuthenticationService} from './shared/services/authentication.service';
import {AuthGuardService} from './shared/services/auth-guard.service';
import {
  CourseService, TaskService, UserDataService, LectureService,
  UnitService, AboutDataService, FreeTextUnitService, CodeKataUnitService, APIInfoService
} from './shared/services/data.service';
import {BackendService} from './shared/services/backend.service';

import {ShowProgressService} from './shared/services/show-progress.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CodeKataProgressService, ProgressService} from './shared/services/data/progress.service';
import {MarkdownService} from './shared/services/markdown.service';
import {AppRoutingModule} from './app-routing.module';
import {StartModule} from './start/start.module';
import {SharedModule} from './shared/shared.module';
import {UserModule} from './user/user.module';
import {AuthModule} from './auth/auth.module';
import {AboutModule} from './about/about.module';
import {AdminModule} from './admin/admin.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AdminModule,
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    StartModule,
    UserModule,
    AuthModule,
    AboutModule,
    SharedModule
  ],
  providers: [
    UserService,
    AuthenticationService,
    AboutDataService,
    AuthGuardService,
    UnitService,
    TaskService,
    CourseService,
    UserDataService,
    LectureService,
    BackendService,
    UserDataService,
    ProgressService,
    ShowProgressService,
    MarkdownService,
    FreeTextUnitService,
    CodeKataUnitService,
    CodeKataProgressService,
    APIInfoService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
