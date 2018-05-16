import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {UserService} from '../shared/services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CourseService} from '../shared/services/data.service';
import {ReportService} from "../shared/services/data/report.service";

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportComponent implements OnInit {

  public courseId: string;
  public courseName: string;

  constructor(
    public userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private reportService: ReportService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.courseId = decodeURIComponent(params['id']);
    });
    this.getCourseData();
  }

  private getCourseData() {
    this.courseService.readSingleItem(this.courseId)
      .then((course: any) => {
        this.courseName = course.name;
      })
      .catch((err) => {
      });
  }

  private exportReport() {
    this.reportService.getCourseResults(this.courseId)
      .then((result) => {
        let report = result;
        this.generateCsvContent(report);
    });
  }

  private generateCsvContent(report: any[]) {
    let reportData: any[] = [];
    for (let student of report) {
      for (let unit of student.progress.units) {
        let status: string;
        let answers: string;
        if (unit.__t === "task") {
          if (unit.done) {
            status = "done;";
          }
          else {
            status = "tried;";
          }

          for (let answer of unit.tasks[0].answers) {
            if (answer.value) {
              answers += answer.text + ";";
            }
          }

        }
        else if (unit.__t === "code-kata") {
          if (unit.progressData.done) {
            status = "done";
          }
          else {
            status = "tried"
          }
        }

        let entry = {
          id : student.uid,
          lastName: student.profile.lastName,
          firstName: student.profile.firstName,
          unit: unit.name,
          unitType: unit.__t,
          status: status,
          answers: null,
        };
        reportData.push(entry);
      }
    }
    console.log(reportData);
  }
}
