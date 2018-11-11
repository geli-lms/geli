import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StartComponent} from './start.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {HomescreenComponent} from './homescreen/homescreen.component';
import {DashboardStudentComponent} from './dashboard/dashboard-student/dashboard-student.component';
import {DashboardTeacherComponent} from './dashboard/dashboard-teacher/dashboard-teacher.component';
import {DashboardAdminComponent} from './dashboard/dashboard-admin/dashboard-admin.component';
import {RouterModule} from '@angular/router';
import {CourseModule} from '../course/course.module';
import {SharedModule} from '../shared/shared.module';
import {NotificationModule} from '../notification/notification.module';
import {InfoBoxComponent} from './homescreen/info-box/info-box.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    CourseModule,
  ],
  declarations: [
    StartComponent,
    DashboardComponent,
    HomescreenComponent,
    DashboardStudentComponent,
    DashboardTeacherComponent,
    DashboardAdminComponent,
    InfoBoxComponent,
  ],
  exports: [
    StartComponent,
    DashboardComponent,
    HomescreenComponent,
    DashboardStudentComponent,
    DashboardTeacherComponent,
    DashboardAdminComponent,
  ]
})
export class StartModule {
}
