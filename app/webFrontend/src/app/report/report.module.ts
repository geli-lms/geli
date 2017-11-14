import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report.component';
import {SharedModule} from '../shared/shared.module';
import {NgxChartsModule} from '@swimlane/ngx-charts';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgxChartsModule
  ],
  declarations: [ReportComponent]
})
export class ReportModule { }
