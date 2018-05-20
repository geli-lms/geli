import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {UserService} from '../shared/services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CourseService} from '../shared/services/data.service';
import {ReportService} from '../shared/services/data/report.service';
import {saveAs}from 'file-saver/FileSaver';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportComponent implements OnInit {

  public courseId: string;
  public courseName: string;

  private converter = require('json-2-csv');
  private options = {
    delimiter: {
      field: ';',
      array: ',',
      eol : '\n'
    },
  };

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
        const csvContent = this.generateCsvContent(report);
        this.converter.json2csv(csvContent, this.createDownload, this.options);
    });
  }

  private generateCsvContent(report: any[]) {
    let csvContent: any[] = [];
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
        csvContent.push(entry);
      }
    }
    return csvContent;
  }

  private createDownload(err, csv) {
    if (err) {
      throw err;
    }
    const file = new Blob([csv], {type: 'text/csv'});
    saveAs(file, "Report.csv");
  }
}
