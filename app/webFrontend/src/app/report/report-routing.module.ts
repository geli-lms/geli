import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from '../shared/services/auth-guard.service';
import {ReportComponent} from './report.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ReportComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['teacher', 'admin']}
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ReportRoutingModule {
}
