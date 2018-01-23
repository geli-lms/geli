import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report.component';
import {SharedModule} from '../shared/shared.module';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import { UnitReportComponent } from './unit-report/unit-report.component';
import {ReportRoutingModule} from './report-routing.module';
import { ReportOverviewComponent } from './report-overview/report-overview.component';
import {TeacherReportComponent} from './teacher-report/teacher-report.component';
import {UserModule} from '../user/user.module';
import {ProgressModule} from '../progress/progress.module';
import { UnitReportDetailsComponent } from './unit-report-details/unit-report-details.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgxChartsModule,
    ReportRoutingModule,
    UserModule,
    ProgressModule
  ],
  declarations: [
    ReportComponent,
    ReportOverviewComponent,
    UnitReportComponent,
    TeacherReportComponent,
    UnitReportDetailsComponent
  ]
})
export class ReportModule { }
