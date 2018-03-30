import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CourseEditComponent} from './course-edit.component';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import {GeneralTabComponent} from './general-tab/general-tab.component';
import {MembersComponent} from './members/members.component';
import {TeachersComponent} from './teachers/teachers.component';
import {CourseMediaComponent} from './course-media/course-media.component';

const routes: Routes = [
  {
    path: '',
    component: CourseEditComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['teacher', 'admin']},
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: GeneralTabComponent,
        canActivate: [AuthGuardService],
        data: {roles: ['teacher', 'admin']},
      },
      {
        path: 'content',
        loadChildren: 'app/course/course-edit/course-manage-content/course-manage-content.module#CourseManageContentModule',
      },
      {
        path: 'media',
        component: CourseMediaComponent,
        canActivate: [AuthGuardService],
        data: {roles: ['teacher', 'admin']},
      },
      {
        path: 'members',
        component: MembersComponent,
        canActivate: [AuthGuardService],
        data: {roles: ['teacher', 'admin']},
      },
      {
        path: 'teachers',
        component: TeachersComponent,
        canActivate: [AuthGuardService],
        data: {roles: ['teacher', 'admin']},
      },
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
export class CourseEditRoutingModule {
}
