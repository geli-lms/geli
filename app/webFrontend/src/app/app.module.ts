import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';


import { AppComponent } from './app.component';
import { LoginComponent } from './user/login/login.component';
import { UserDetailsComponent } from './user/user-details/user-details.component';
import { MaterialModule } from '@angular/material';

import { routes } from './app.routes';
import { UserService } from './shared/user.service';
import { AuthenticationService } from './shared/authentification.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomescreenComponent } from './homescreen/homescreen.component';
import { RegisterComponent } from './user/register/register.component';
import { AuthGuardService } from './shared/auth-guard.service';
import { DashboardStudentComponent } from './dashboard/dashboard-student/dashboard-student.component';
import { DashboardTeacherComponent } from './dashboard/dashboard-teacher/dashboard-teacher.component';
import { DashboardAdminComponent } from './dashboard/dashboard-admin/dashboard-admin.component';
import { CourseService} from './shared/data.service';
import { BackendService } from './shared/backend.service';
import { CourseComponent } from './course/course.component';
import { CourseDetailComponent } from './course/course-detail/course-detail.component';
import { CourseEditComponent } from './course/course-edit/course-edit.component';
import { DataService } from './shared/data.service';
import { CourseNewComponent } from './course/course-new/course-new.component';

import { ShowProgressService } from './shared/show-progress.service';
import { UnitComponent } from './course/course-edit/unit/unit.component';
import { ManageContentComponent } from './course/course-edit/manage-content/manage-content.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


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
    CourseComponent,
    CourseDetailComponent,
    CourseEditComponent,
    CourseNewComponent,
    UnitComponent,
    ManageContentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MaterialModule.forRoot(),
    MaterialModule.forRoot(),
    ReactiveFormsModule
  ],
  providers: [UserService,
              AuthenticationService,
              AuthGuardService,
              CourseService,
              BackendService,
              DataService,
              ShowProgressService],
  bootstrap: [AppComponent]
})
export class AppModule { }
