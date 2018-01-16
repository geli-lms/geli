import { NgModule } from '@angular/core';
import {CourseManageContentComponent} from './course-manage-content.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from '../../../shared/services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: CourseManageContentComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['teacher', 'admin']},
  },
  {
    path: 'lecture/add',
    pathMatch: 'full',
    component: CourseManageContentComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['teacher', 'admin']},
  },
  {
    path: 'lecture/:lecture',
    component: CourseManageContentComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['teacher', 'admin']},
  },
  {
    path: 'lecture/:lecture/unit/add/:type',
    pathMatch: 'full',
    component: CourseManageContentComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['teacher', 'admin']},
  },
  {
    path: 'lecture/:lecture/unit/:unit',
    component: CourseManageContentComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['teacher', 'admin']},
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
export class CourseManageContentRoutingModule { }
