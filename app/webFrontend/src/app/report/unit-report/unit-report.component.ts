import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ReportService} from '../../shared/services/data/report.service';
import {UserService} from '../../shared/services/user.service';
import {User} from '../../models/User';
import {IUnit} from '../../../../../../shared/models/units/IUnit';

@Component({
  selector: 'app-unit-report',
  templateUrl: './unit-report.component.html',
  styleUrls: ['./unit-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UnitReportComponent implements OnInit {

  private unitId: string;
  private courseId: string;

  public unit: IUnit;
  public report: any;

  public diagramColors = {
    domain: ['#5AA454', '#C7B42C', '#A10A28']
  };

  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService,
    private userService: UserService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.unitId = decodeURIComponent(params['id']);
    });
    this.route.parent.params.subscribe(params => {
      this.courseId = decodeURIComponent(params['id']);
    });
    this.getReport();
  }

  private getReport() {
    this.reportService.getUnitDetailForCourse(this.courseId, this.unitId)
      .then((report) => {
        this.report = report;
        this.report.details.map((student) => new User(student));
      })
      .catch((err) => {
      });
  }

}
