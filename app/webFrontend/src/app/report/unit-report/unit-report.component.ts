import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ReportService} from '../../shared/services/data/report.service';
import {IProgress} from '../../../../../../shared/models/IProgress';

@Component({
  selector: 'app-unit-report',
  templateUrl: './unit-report.component.html',
  styleUrls: ['./unit-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UnitReportComponent implements OnInit {

  private unitId: string;
  private courseId: string;

  public report: IProgress[];

  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.unitId = decodeURIComponent(params['id']);
    });
    this.getReport();
  }

  private getReport() {
    this.reportService.getUnitDetailForCourse(this.unitId)
      .then((report) => {
        const debug = 0;
      })
      .catch((err) => {
      })
  }

}
