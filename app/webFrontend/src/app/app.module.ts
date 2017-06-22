import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';


import {AppComponent} from './app.component';
import {LoginComponent} from './user/login/login.component';
import {UserDetailsComponent} from './user/user-details/user-details.component';
import {MaterialModule} from '@angular/material';
import {JwtHelper} from 'angular2-jwt';

import {routes} from './app.routes';
import {UserService} from './shared/services/user.service';
import {AuthenticationService} from './shared/services/authentication.service';
import {DashboardComponent} from './start/dashboard/dashboard.component';
import {HomescreenComponent} from './start/homescreen/homescreen.component';
import {RegisterComponent} from './user/register/register.component';
import {AuthGuardService} from './shared/services/auth-guard.service';
import { DragulaModule } from 'ng2-dragula';
import {DashboardStudentComponent} from './start/dashboard/dashboard-student/dashboard-student.component';
import {DashboardTeacherComponent} from './start/dashboard/dashboard-teacher/dashboard-teacher.component';
import {DashboardAdminComponent} from './start/dashboard/dashboard-admin/dashboard-admin.component';
import {
  CourseService, TaskService, UserDataService, LectureService,
  UnitService, AboutDataService
} from './shared/services/data.service';
import {BackendService} from './shared/services/backend.service';
import {CourseComponent} from './course/course.component';
import {CourseDetailComponent} from './course/course-detail/course-detail.component';
import {CourseEditComponent} from './course/course-edit/course-edit.component';
import {CourseNewComponent} from './course/course-new/course-new.component';
import {TaskUnitEditComponent} from './course/course-edit/unit/unit-edit/task-unit-edit/task-unit-edit.component';

import {ShowProgressService} from './shared/services/show-progress.service';
import {UnitComponent} from './course/course-edit/unit/unit.component';
import {LectureComponent} from './lecture/lecture.component';
import {UploadComponent} from './upload/upload.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MembersComponent} from './course/course-edit/members/members.component';
import {UserAdminComponent} from './admin/user-admin/user-admin.component';
import {UserEditComponent} from './user/user-edit/user-edit.component';
import {ActivationComponent} from './user/activation/activation.component';
import {FileUploadModule} from 'ng2-file-upload/ng2-file-upload';
import {StartComponent} from './start/start.component';

import {AdminComponent} from './admin/admin.component';
import {DialogModule} from './shared/modules/dialog/dialog.module';
import {TeacherReportComponent} from './course/teacher-report/teacher-report.component';
import {UnitMenuComponent} from './shared/components/unit-menu/unit-menu.component';
import {UnitFormComponent} from './course/course-edit/unit/unit-edit/unit-form.component';
import {TaskUnitComponent} from './course/course-edit/unit/task-unit/task-unit.component';
import {LectureFormComponent} from './lecture/lecture-form/lecture-form.component';
import {AboutComponent} from './about/about.component';
import {GeneralInfoComponent} from './about/general-info/general-info.component';
import {LicensesComponent} from './about/licenses/licenses.component';
import {GravatarDirective} from './course/course-edit/members/gravatar.directive';
import { CourseManageContentComponent } from './course/course-edit/course-manage-content/course-manage-content.component';
import { MdFabMenuComponent } from './shared/components/md-fab-menu/md-fab-menu.component';
import {CodeKataComponent} from './course/course-edit/unit/code-kata-unit/code-kata-unit.component';
import {CodeKataUnitFormComponent} from './course/course-edit/unit/unit-edit/code-kata-unit-form/code-kata-unit-form.component';
import {AceEditorComponent} from 'ng2-ace-editor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserDetailsComponent,
    DashboardComponent,
    HomescreenComponent,
    RegisterComponent,
    DashboardStudentComponent,
    DashboardTeacherComponent,
    DashboardAdminComponent,
    TaskUnitEditComponent,
    CourseComponent,
    CourseDetailComponent,
    CourseEditComponent,
    CourseNewComponent,
    UnitComponent,
    MembersComponent,
    LectureComponent,
    UserAdminComponent,
    UserEditComponent,
    UploadComponent,
    ActivationComponent,
    StartComponent,
    AdminComponent,
    LectureFormComponent,
    TeacherReportComponent,
    UnitMenuComponent,
    UnitFormComponent,
    TaskUnitComponent,
    AboutComponent,
    GeneralInfoComponent,
    LicensesComponent,
    GravatarDirective,
    CourseManageContentComponent,
    MdFabMenuComponent,
    CodeKataComponent,
    CodeKataUnitFormComponent,
    AceEditorComponent
  ],
  imports: [
    DragulaModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FileUploadModule,
    DialogModule
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
    ShowProgressService,
    JwtHelper
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
