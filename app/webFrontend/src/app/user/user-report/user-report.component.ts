import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {UserService} from '../../shared/services/user.service';
import {ReportService} from '../../shared/services/data/report.service';
import {IUser} from '../../../../../../shared/models/IUser';

@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrls: ['./user-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserReportComponent implements OnInit {

  @Input()
  user: IUser;

  public report: any;
  public diagramColors = {
    domain: ['#A10A28', '#C7B42C', '#5AA454']
  };

  constructor(
    public userService: UserService,
    private reportService: ReportService
  ) { }

  ngOnInit() {
    this.getReport();
  }

  private getReport() {
    this.reportService.getUserOverview(this.user._id)
      .then((report) => {
        this.report = report;
      })
      .catch((err) => {
        const debug = 0;
      });
  }
}
