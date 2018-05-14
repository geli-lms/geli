import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from '../shared/services/auth-guard.service';
import {UserDetailsComponent} from './user-details/user-details.component';
import {UserEditComponent} from './user-edit/user-edit.component';
import {allRoles} from '../../../../../shared/roles';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: UserDetailsComponent,
    canActivate: [AuthGuardService],
    data: {roles: allRoles}
  },
  {
    path: 'edit',
    component: UserEditComponent,
    canActivate: [AuthGuardService],
    data: {roles: allRoles}
  },
  {
    path: ':id',
    component: UserDetailsComponent,
    canActivate: [AuthGuardService],
    data: {roles: allRoles}
  },
  {
    path: ':id/edit',
    component: UserEditComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['teacher', 'admin']}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}
