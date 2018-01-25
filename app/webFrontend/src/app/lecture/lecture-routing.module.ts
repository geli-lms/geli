import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LectureComponent} from './lecture.component';
import {AuthGuardService} from '../shared/services/auth-guard.service';
import {CourseDetailComponent} from '../course/course-detail/course-detail.component';

const routes: Routes = [
  {
    path: '',
    component: LectureComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['student', 'teacher', 'admin']},
  },
];


@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ]
})
export class LectureRoutingModule { }
