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
            console.log('unit');
            for (let i = 0; i < this.progress.length; i++) {
              console.log('StudentID: ' + studentWithUnits._id + ' ProgressStudentID: ' + this.progress[i].user);
              console.log('UnitID: ' + unitWithProgress._id + ' ProgressUnitID: ' + this.progress[i].unit._id);
              if (studentWithUnits._id === this.progress[i].user && unitWithProgress._id === this.progress[i].unit._id) {
                unitWithProgress.done = true;
                studentWithUnits.finishCount++;
                break;
              }
              console.log(i);
            }
            studentWithUnits.units.push(unitWithProgress);
          });
          this.report.push(studentWithUnits);
        });
      });
  }

}
