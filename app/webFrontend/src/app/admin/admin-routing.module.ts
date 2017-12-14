import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from '../shared/services/auth-guard.service';
import {UserAdminComponent} from './user-admin/user-admin.component';
import {ImprintAdminComponent} from './imprint-admin/imprint-admin.component';
import {AdminComponent} from './admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['admin']},
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full',
      },
      {
        path: 'users',
        component: UserAdminComponent,
        canActivate: [AuthGuardService],
        data: {roles: ['admin']}
      },
      {
        path: 'imprint',
        component: ImprintAdminComponent,
        canActivate: [AuthGuardService],
        data: {roles: ['admin']}
      },
    ]
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
export class AdminRoutingModule {
}
