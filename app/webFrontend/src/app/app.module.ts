import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {AppComponent} from './app.component';
import {RavenErrorHandler} from './shared/services/raven-error-handler.service';
import {UserService} from './shared/services/user.service';
import {AuthenticationService} from './shared/services/authentication.service';
import {AuthGuardService} from './shared/services/auth-guard.service';
import {WhitelistService} from './shared/services/whitelist.service';
import {
  AboutDataService,
  APIInfoService,
  CodeKataUnitService,
  CourseService,
  DownloadFileService,
  FreeTextUnitService,
  LectureService,
  MediaService,
  UnitService,
  UserDataService,
  WhitelistUserService,
  ConfigService,
  AssignmentService
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
import {ThemeService} from './shared/services/theme.service';
import {FileModule} from './file/file.module';
import {DataSharingService} from './shared/services/data-sharing.service';
import {NotificationModule} from './notification/notification.module';
import {HttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {ImprintAndInfoService} from './shared/services/imprint-and-info.service';
import {NotfoundComponent} from './shared/components/notfound/notfound.component';
import {SnackBarService} from './shared/services/snack-bar.service';
import {UnitFormService} from './shared/services/unit-form.service';
import {UnitFactoryService} from './shared/services/unit-factory.service';
import {ChatService} from './shared/services/chat.service';
import {MessageService} from './shared/services/message.service';
import {FileIconService} from './shared/services/file-icon.service';
import {MessagingModule} from './messaging/messaging.module';
import {PrivacyModule} from './privacy/privacy.module';
import {TranslationErrorService} from './shared/services/translation-error.service';
import {MissingTranslationHandler} from '@ngx-translate/core';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    StartModule,
    UserModule,
    AuthModule,
    AboutModule,
    SharedModule,
    AdminModule,
    MessagingModule,
    FileModule,
    PrivacyModule,
    TranslateModule.forRoot({
      missingTranslationHandler: {provide: MissingTranslationHandler, useClass: TranslationErrorService},
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NotificationModule
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
    MediaService,
    ThemeService,
    ConfigService,
    ChatService,
    MessageService,
    NotfoundComponent,
    AssignmentService,
    {
      provide: ErrorHandler,
      useExisting: RavenErrorHandler
    },
    DataSharingService,
    ImprintAndInfoService,
    SnackBarService,
    UnitFormService,
    UnitFactoryService,
    FileIconService,
    WhitelistService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
