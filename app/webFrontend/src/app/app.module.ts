import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {RavenErrorHandler} from './shared/services/raven-error-handler.service';
import {UserService} from './shared/services/user.service';
import {AuthenticationService} from './shared/services/authentication.service';
import {AuthGuardService} from './shared/services/auth-guard.service';
import {
  AboutDataService,
  APIInfoService,
  CodeKataUnitService,
  CourseService,
  DownloadFileService,
  FreeTextUnitService,
  LectureService,
  TaskService,
  UnitService,
  UserDataService,
  WhitelistUserService,
  ConfigService,
} from './shared/services/data.service';
import {BackendService} from './shared/services/backend.service';
import {ShowProgressService} from './shared/services/show-progress.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ProgressService} from './shared/services/data/progress.service';
import {MarkdownService} from './shared/services/markdown.service';
import {AppRoutingModule} from './app-routing.module';
import {StartModule} from './start/start.module';
import {SharedModule} from './shared/shared.module';
import {UserModule} from './user/user.module';
import {AuthModule} from './auth/auth.module';
import {AboutModule} from './about/about.module';
import {AdminModule} from './admin/admin.module';
import {ReportService} from './shared/services/data/report.service';
import {TitleService} from './shared/services/title.service';
import {ImprintModule} from './imprint/imprint.module';
import {DataSharingService} from './shared/services/data-sharing.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    StartModule,
    UserModule,
    AuthModule,
    AboutModule,
    SharedModule,
    AdminModule,
    ImprintModule,
  ],
  providers: [
    UserService,
    AuthenticationService,
    AboutDataService,
    AuthGuardService,
    UnitService,
    CourseService,
    UserDataService,
    WhitelistUserService,
    LectureService,
    BackendService,
    UserDataService,
    ProgressService,
    ShowProgressService,
    MarkdownService,
    FreeTextUnitService,
    CodeKataUnitService,
    APIInfoService,
    ReportService,
    TitleService,
    DownloadFileService,
    RavenErrorHandler,
    ConfigService,
    {
      provide: ErrorHandler,
      useExisting: RavenErrorHandler
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
