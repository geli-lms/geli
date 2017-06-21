import { Component, OnInit } from '@angular/core';
import {CourseService, UnitService} from '../../shared/services/data.service';
import {User} from '../../models/User';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {IUnit} from '../../../../../../shared/models/units/IUnit';
import {ActivatedRoute} from '@angular/router';
import {IProgress} from '../../../../../../shared/models/IProgress';
import {ProgressService} from '../../shared/services/data/progress.service';
import {IUser} from '../../../../../../shared/models/IUser';

@Component({
  selector: 'app-teacher-report',
  templateUrl: './teacher-report.component.html',
  styleUrls: ['./teacher-report.component.scss']
})
export class TeacherReportComponent implements OnInit {

  id: string;
  course: ICourse;
  students: IUser[];
  progressableUnits: IUnit[] = [];

  constructor(private route: ActivatedRoute,
              private courseService: CourseService,
              private unitService: UnitService,
              private progressService: ProgressService) { }

  ngOnInit() {
    this.route.params.subscribe(params => { this.id = decodeURIComponent(params['id']); });
    this.getCourseAndStudents();
  }

  getCourseAndStudents() {
    this.courseService.readSingleItem(this.id)
      .then(
        (course: any) => {
          this.course = course;
          this.students = course.students;
          for (const lecture of course.lectures) {
            for (const unit of lecture.units) {
              if (unit.progressable) {
                this.progressableUnits.push(unit);
              }
            }
          }
          console.log('debug');
        },
        (err: any) => {
          console.log(err);
      })
      .then(() => {
        if (this.course) {
          this.getProgress();
        }
      });
  }

  getProgress() {
    const students = this.students;
    const progressableUnits = this.progressableUnits;
    this.progressService.getCourseProgress(this.id)
      .then((progress: any[]) => {
        for (let i = 0; i < students.length; i++) {
          if (typeof students[i].progress === 'undefined') {
            students[i].progress = [];
          }

          for (let j = 0; j < progressableUnits.length; j++) {
            let done = false;
            for (let k = progress.length - 1; k >= 0; k--) {
              if (students[i]._id === progress[k].user && progressableUnits[j] === progress[k].unit) {
                students[i].progress.push(progress[k]);
                done = true;
                break;
              }
            }
            if (!done) {
              students[i].progress.push({
                course: this.id,
                unit: progressableUnits[j],
                user: students[i],
                done: done
              });
            }
          }

        }
      });
  }

}
