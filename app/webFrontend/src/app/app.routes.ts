import { LoginComponent } from './user/login/login.component';
import { UserDetailsComponent } from './user/user-details/user-details.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {HomescreenComponent} from './homescreen/homescreen.component';
import {RegisterComponent} from './user/register/register.component';
import {AuthGuardService} from './shared/auth-guard.service';
import {CourseDetailComponent} from './course/course-detail/course-detail.component';
import {CourseEditComponent} from './course/course-edit/course-edit.component';
import {CourseNewComponent} from './course/course-new/course-new.component';
import {UserRolesComponent} from './admin/user-roles/user-roles.component';

export const routes = [
    { path: '', component: HomescreenComponent, pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'course/edit/:id', component: CourseEditComponent, canActivate: [AuthGuardService], data: { roles: ['teacher', 'admin']}},
    { path: 'course/new', component: CourseNewComponent, canActivate: [AuthGuardService], data: { roles: ['teacher', 'admin']}},
    { path: 'course/detail/:name', component: CourseDetailComponent, canActivate: [AuthGuardService], data: { roles: ['student', 'teacher', 'admin']}},
    { path: 'profile', component: UserDetailsComponent, canActivate: [AuthGuardService], data: { roles: ['student', 'teacher', 'admin']}},
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService], data: { roles: ['student', 'teacher', 'admin']}},
    { path: 'admin/users', component: UserRolesComponent, canActivate: [AuthGuardService], data: { roles: ['admin']}}
];
