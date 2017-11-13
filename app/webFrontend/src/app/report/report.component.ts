import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {ReportService} from '../shared/services/data/report.service';
import {UserService} from '../shared/services/user.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportComponent implements OnInit {

  private id: string;

  public report: any

  constructor(
    public userService: UserService,
    private route: ActivatedRoute,
    private reportService: ReportService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = decodeURIComponent(params['id']);
    });
    this.getReport();
  }

  private getReport() {
    this.reportService.getCourseProgress(this.id)
      .then((report) => {
        this.report = report;
      })
      .catch((err) => {
      });
  }
}
