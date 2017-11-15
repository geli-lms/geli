import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report.component';
import {SharedModule} from '../shared/shared.module';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import { UnitReportComponent } from './unit-report/unit-report.component';
import { UserReportComponent } from './user-report/user-report.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgxChartsModule
  ],
  declarations: [ReportComponent, UnitReportComponent, UserReportComponent]
})
export class ReportModule { }
