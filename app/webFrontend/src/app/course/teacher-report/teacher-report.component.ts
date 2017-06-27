import { Component, OnInit } from '@angular/core';
import {CourseService, UnitService} from '../../shared/services/data.service';
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
  progress: IProgress[];
  report: any[] = [];

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
    const progressableUnits = this.progressableUnits;
    this.progressService.getCourseProgress(this.id)
      .then((progress: any) => {
        this.progress = progress;
        this.students.map((student) => {
          const studentWithUnits: any = student;
          studentWithUnits.units = [];
          studentWithUnits.finishCount = 0;
          this.progressableUnits.map((progressableUnit) => {
            const unitWithProgress: any = progressableUnit;
            unitWithProgress.done = false;
            for (let i = 0; i < this.progress.length; i++) {
              if (studentWithUnits._id === this.progress[i].user && unitWithProgress._id === this.progress[i].unit._id) {
                unitWithProgress.done = true;
                unitWithProgress.progress = this.progress[i];
                studentWithUnits.finishCount++;
                this.progress.splice(i, 1);
                break;
              }
            }
            studentWithUnits.units.push(unitWithProgress);
          });
          studentWithUnits.completeRate = ((studentWithUnits.finishCount / this.progressableUnits.length) * 100);
          this.report.push(studentWithUnits);
        });
      });
  }

}
