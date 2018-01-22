import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from '../shared/services/auth-guard.service';
import {ReportComponent} from './report.component';
import {UnitReportComponent} from './unit-report/unit-report.component';
import {ReportOverviewComponent} from './report-overview/report-overview.component';
import {TeacherReportComponent} from './teacher-report/teacher-report.component';

const routes: Routes = [
  {
    path: '',
    component: ReportComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['teacher', 'admin']},
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ReportOverviewComponent,
        canActivate: [AuthGuardService],
        data: {roles: ['teacher', 'admin']}
      },
      {
        path: 'unit/:id',
        component: UnitReportComponent,
        canActivate: [AuthGuardService],
        data: {roles: ['teacher', 'admin']}
      },
      {
        path: 'user/all',
        component: TeacherReportComponent,
        canActivate: [AuthGuardService],
        data: {roles: ['teacher', 'admin']}
      }
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
export class ReportRoutingModule {
}
