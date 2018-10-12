import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from '../shared/services/auth-guard.service';
import {UserAdminComponent} from './user-admin/user-admin.component';
import {AdminMiscComponent} from './admin-misc/admin-misc.component';
import {AdminComponent} from './admin.component';
import {ConfigurablePagesFormComponent} from './configurable-pages/configurable-pages-form/configurable-pages-form.component';
import {ConfigurablePagesComponent} from './configurable-pages/configurable-pages.component';

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
        path: 'users/delete/:deleteId',
        component: UserAdminComponent,
        canActivate: [AuthGuardService],
        data: {roles: ['admin']}
      },
      {
        path: 'configurable-pages',
        component: ConfigurablePagesComponent,
        data: {roles: ['admin']}
      },
      {
        path: 'markdownEdit',
        component: ConfigurablePagesFormComponent,
        canActivate: [AuthGuardService],
        data: {roles: ['admin']}
      },
      {
        path: 'misc',
        component: AdminMiscComponent,
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
