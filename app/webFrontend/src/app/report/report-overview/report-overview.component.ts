import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {UserService} from '../../shared/services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ReportService} from '../../shared/services/data/report.service';

@Component({
  selector: 'app-report-overview',
  templateUrl: './report-overview.component.html',
  styleUrls: ['./report-overview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportOverviewComponent implements OnInit {

  private id: string;

  public report: any;
  public diagramColors = {
    domain: ['#A10A28', '#C7B42C', '#5AA454']
  };

  constructor(
    public userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private reportService: ReportService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = decodeURIComponent(params['id']);
    });
    this.getReport();
  }

  private getReport() {
    this.reportService.getCourseOverview(this.id)
    .then((report) => {
      this.report = report;
    })
    .catch((err) => {
      console.log(err);
    });
  }
}
