import {LoginComponent} from './user/login/login.component';
import {UserDetailsComponent} from './user/user-details/user-details.component';
import {RegisterComponent} from './user/register/register.component';
import {ActivationComponent} from './user/activation/activation.component';
import {AuthGuardService} from './shared/services/auth-guard.service';
import {CourseDetailComponent} from './course/course-detail/course-detail.component';
import {CourseEditComponent} from './course/course-edit/course-edit.component';
import {CourseNewComponent} from './course/course-new/course-new.component';
import {UserEditComponent} from './user/user-edit/user-edit.component';
import {LectureEditComponent} from './lecture/lecture-edit/lecture-edit.component';
import {LectureNewComponent} from './lecture/lecture-new/lecture-new.component';
import {StartComponent} from './start/start.component';
import {AdminComponent} from './admin/admin.component';

export const routes = [
  {path: '', component: StartComponent, pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'activate/:token', component: ActivationComponent},
  {
    path: 'course/edit/:id',
    component: CourseEditComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['teacher', 'admin']}
  },
  {
    path: 'course/new',
    component: CourseNewComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['teacher', 'admin']}
  },
  {
    path: 'course/detail/:id',
    component: CourseDetailComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['student', 'tutor', 'teacher', 'admin']}
  },
  {
    path: 'course/edit/:courseId/lecture/edit/:lectureId',
    component: LectureEditComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['teacher', 'admin']}
  },
  {
    path: 'course/edit/:id/lecture/new',
    component: LectureNewComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['teacher', 'admin']}
  },
  {
    path: 'profile',
    component: UserDetailsComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['student', 'tutor', 'teacher', 'admin']}
  },
  {
    path: 'profile/edit',
    component: UserEditComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['student', 'tutor', 'teacher', 'admin']}
  },
  {
    path: 'profile/:id',
    component: UserDetailsComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['student', 'tutor', 'teacher', 'admin']}
  },
  {
    path: 'profile/:id/edit',
    component: UserEditComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['teacher', 'admin']}
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['admin']}
  }
];
