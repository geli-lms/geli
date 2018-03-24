import {NgModule} from '@angular/core';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {ActivationComponent} from './auth/activation/activation.component';
import {StartComponent} from './start/start.component';
import {AboutComponent} from './about/about.component';
import {ResetComponent} from './auth/reset/reset.component';
import {RouterModule, Routes} from '@angular/router';
import {ImprintComponent} from './imprint/imprint.component';
import {UserSettingsComponent} from './user/user-settings/user-settings.component';
import {AuthGuardService} from './shared/services/auth-guard.service';

const routes: Routes = [
  {path: '', component: StartComponent, pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'activate/:token', component: ActivationComponent},
  {path: 'reset', component: ResetComponent},
  {path: 'reset/:token', component: ResetComponent},
  {
    path: 'course',
    loadChildren: 'app/course/course.module#CourseModule'
  },
  {
    path: 'profile',
    loadChildren: 'app/user/user.module#UserModule'
  },
  {
    path: 'admin',
    loadChildren: 'app/admin/admin.module#AdminModule'
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'imprint',
    component: ImprintComponent
  },
  {
    path: 'userSettings',
    component: UserSettingsComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['student']}
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
