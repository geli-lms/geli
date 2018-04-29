import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import {CourseOverviewComponent} from './course-overview/course-overview.component';
import {FileViewComponent} from './file-view/file-view.component';
import {CourseDetailComponent} from './course-detail.component';
import {CourseDetailDataResolve} from '../../shared/services/course-detail-data-resolve.service';


const routes: Routes = [
  {
    path: '',
    component: CourseDetailComponent,
    resolve: {course: CourseDetailDataResolve},
    canActivate: [AuthGuardService],
    data: {roles: ['student', 'tutor', 'teacher', 'admin']},
    children: [
      {
        path: '',
        component: CourseOverviewComponent,
        canActivate: [AuthGuardService],
        data: {roles: ['student', 'tutor', 'teacher', 'admin']}
      },
      {
        path: 'overview',
        component: CourseOverviewComponent,
        canActivate: [AuthGuardService],
        data: {roles: ['student', 'tutor', 'teacher', 'admin']}
      },
      {
        path: 'fileview',
        component: FileViewComponent,
        canActivate: [AuthGuardService],
        data: {roles: ['student', 'tutor', 'teacher', 'admin']}
      }
    ],
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
export class CourseDetailRoutingModule {
}
