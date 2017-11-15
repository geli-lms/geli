import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from '../shared/services/auth-guard.service';
import {ReportComponent} from './report.component';
import {UnitReportComponent} from './unit-report/unit-report.component';
import {UserReportComponent} from './user-report/user-report.component';

const routes: Routes = [
  {
    path: 'unit/:id',
    component: UnitReportComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['teacher', 'admin']}
  },
  {
    path: 'user/:id',
    component: UserReportComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['teacher', 'admin']}
  },
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
