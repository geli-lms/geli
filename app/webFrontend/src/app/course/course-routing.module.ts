import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from '../shared/services/auth-guard.service';
import {CourseNewComponent} from './course-new/course-new.component';
import {CourseDetailComponent} from './course-detail/course-detail.component';
import {TeacherReportComponent} from '../report/teacher-report/teacher-report.component';
import {ReportComponent} from '../report/report.component';

const routes: Routes = [
  {
    path: 'new',
    component: CourseNewComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['teacher', 'admin']}
  },
  {
    path: ':id',
    component: CourseDetailComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['student', 'tutor', 'teacher', 'admin']}
  },
  {
    path: ':id/edit',
    loadChildren: 'app/course/course-edit/course-edit.module#CourseEditModule'
  },
  {
    path: ':id/report',
    component: ReportComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['teacher', 'admin']}
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class CourseRoutingModule {
}
