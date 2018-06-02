import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {UserService} from '../shared/services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CourseService} from '../shared/services/data.service';
import {ReportService} from '../shared/services/data/report.service';
import {saveAs} from 'file-saver/FileSaver';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportComponent implements OnInit {

  public courseId: string;
  public courseName: string;
  public course: any;

  private converter = require('json-2-csv');
  private delimiter: {
      field: ';',
      array: ',',
      eol: '\n'
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
        this.course = course;
      })
      .catch((err) => {
      });
  }

  private exportReport() {
    const tasks = this.filterCourseForTasks();
    const header = this.generateCsvHeader(tasks);
    this.reportService.getCourseResults(this.courseId)
      .then((result) => {
      const csvContent = this.generateCsvContent(result, tasks, header);
      this.createDownload(csvContent);
    });
  }
  private filterCourseForTasks() {
    const tasks: any[] = [];
    this.course.lectures.forEach(lecture => {
      lecture.units.forEach(unit => {
        if (unit.__t === 'task' || unit.__t === 'code-kata') {
          tasks.push(unit);
        }
      });
    });
    return tasks;
  }
  private generateCsvHeader(tasks: any[]) {
    let header = 'Matrikelnummer;';
    header += 'Nachname;';
    header += 'Vorname;';
    let counter = 1;
    tasks.forEach(task => {
      header += counter + '.name;';
      header += counter + '.type;';
      header += counter + '.status;';
      if (task.__t === 'task') {
        header += counter + '.answers;';
      }
      counter++;
    });
    header += 'ENDERGEBNIS;\n';
    return header;
  }
  private generateCsvContent(reports: any[], units: any[], header: string) {
    const content: string[] = [];
    content.push(header);
    reports.forEach(report => { // create an entry for each student
      let entry = '';
      entry += report.uid + ';';
      entry += report.profile.lastName + ';';
      entry += report.profile.firstName + ';';
      units.forEach(unit => {
        entry += unit.name + ';';
        entry += unit.__t + ';';
        const unitProgress = report.progress.units.find (rep => rep.id === unit.id);

        if (unitProgress) {
          if (unitProgress.progressData.done) {
            entry += 'solved;';
          } else {
            entry += 'tried;';
          }
          if (unit.__t === 'task') {
            let answerAdded = false;
            for (const answer of unitProgress.tasks[0].answers) {
              if (answer.value) {
                entry += answer.text + ',';
                answerAdded = true;
              }
            }
            if (answerAdded) {
              entry = entry.substr(0, entry.length - 1);
            }
            entry += ';';
          }
        } else { // no entry in progress data -> task not worked on
          entry += 'nothing;';
          if (unit.__t === 'task') {
            entry += ';';
          }
        }
      });
      entry += '\n';
      content.push(entry);
    });

    return content;
  }

  private createDownload(csvContent: string[]) {
    const file = new Blob(csvContent, {type: 'text/csv'});
    saveAs(file, this.course.name.replace(/\s/g, '') + 'Report.csv');
  }
}
