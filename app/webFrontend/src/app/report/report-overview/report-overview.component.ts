import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {UserService} from '../../shared/services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ReportService} from '../../shared/services/data/report.service';
import {ShowProgressService} from '../../shared/services/show-progress.service';

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
    private reportService: ReportService,
    private showProgress: ShowProgressService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = decodeURIComponent(params['id']);
    });
    this.getReport();
  }

  private getReport() {
    this.showProgress.toggleLoadingGlobal(true);
    this.reportService.getCourseOverview(this.id)
    .then((report) => {
      this.report = report;
      this.showProgress.toggleLoadingGlobal(false);
    })
    .catch((err) => {
      this.showProgress.toggleLoadingGlobal(false);
    });
  }

  public editUnit(lectureId, unitId) {
    this.router.navigate(['../../edit/content/lecture', lectureId, 'unit', unitId], {relativeTo: this.route});
  }
}
