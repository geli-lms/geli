import {NgModule} from '@angular/core';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {ActivationComponent} from './auth/activation/activation.component';
import {StartComponent} from './start/start.component';
import {AboutComponent} from './about/about.component';
import {ResetComponent} from './auth/reset/reset.component';
import {RouterModule, Routes} from '@angular/router';
import {FileComponent} from './file/file.component';
import {LegalnoticeComponent} from './privacy/legalnotice/legalnotice.component';
import {PrivacyComponent} from './privacy/privacynotice/privacy.component';
import {UserSettingsComponent} from './user/user-settings/user-settings.component';
import {AuthGuardService} from './shared/services/auth-guard.service';
import {ActivationResendComponent} from './auth/activation-resend/activation-resend.component';
import {NotfoundComponent} from './shared/components/notfound/notfound.component';

const routes: Routes = [
  {path: 'not-found', component: NotfoundComponent},
  {path: '', component: StartComponent, pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'activation-resend', component: ActivationResendComponent},
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
    path: 'file/:path',
    component: FileComponent
  },
  {
    path: 'legalnotice',
    component: LegalnoticeComponent
  },
  {
    path: 'privacy',
    component: PrivacyComponent
  },
  {
    path: 'userSettings',
    component: UserSettingsComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['student']}
  },
  {path: '**', redirectTo: 'not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
