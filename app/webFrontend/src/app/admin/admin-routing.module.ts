import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from '../shared/services/auth-guard.service';
import {UserAdminComponent} from './user-admin/user-admin.component';
import {AdminMiscComponent} from './admin-misc/admin-misc.component';
import {AdminComponent} from './admin.component';
import {AdminMarkdownEditComponent} from '../shared/components/admin-markdown-edit/admin-markdown-edit.component';

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
        path: 'markdownEdit',
        component: AdminMarkdownEditComponent,
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
