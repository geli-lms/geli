import {Component, OnInit} from '@angular/core';
import {CourseService, UnitService} from '../../shared/services/data.service';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {IUnit} from '../../../../../../shared/models/units/IUnit';
import {ActivatedRoute, Router} from '@angular/router';
import {IProgress} from '../../../../../../shared/models/IProgress';
import {ProgressService} from '../../shared/services/data/progress.service';
import {UserService} from '../../shared/services/user.service';
import {User} from '../../models/User';
import {ShowProgressService} from '../../shared/services/show-progress.service';
import {ReportService} from '../../shared/services/data/report.service';

@Component({
  selector: 'app-teacher-report',
  templateUrl: './teacher-report.component.html',
  styleUrls: ['./teacher-report.component.scss']
})
export class TeacherReportComponent implements OnInit {

  id: string;
  course: ICourse;
  students: User[];
  progress: IProgress[];
  report: any;

  public diagramColors = {
    domain: ['#A10A28', '#C7B42C', '#5AA454']
  };

  constructor(private route: ActivatedRoute,
              private router: Router,
              private reportService: ReportService,
              private userService: UserService,
              private showProgress: ShowProgressService) {
  }

  ngOnInit() {
    this.route.parent.params.subscribe(params => {
      this.id = decodeURIComponent(params['id']);
    });
    this.getReport();
  }

  getReport() {
    this.reportService.getCourseResults(this.id)
      .then((report) => {
        this.report = report.map((studentReport) => new User(studentReport));
      })
      .catch((err) => {
      })
  }
}
