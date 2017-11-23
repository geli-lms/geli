import {Component, OnInit} from '@angular/core';
import {CourseService, UnitService} from '../../shared/services/data.service';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {IUnit} from '../../../../../../shared/models/units/IUnit';
import {ActivatedRoute} from '@angular/router';
import {IProgress} from '../../../../../../shared/models/IProgress';
import {ProgressService} from '../../shared/services/data/progress.service';
import {UserService} from '../../shared/services/user.service';
import {User} from '../../models/User';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-teacher-report',
  templateUrl: './teacher-report.component.html',
  styleUrls: ['./teacher-report.component.scss']
})
export class TeacherReportComponent implements OnInit {

  id: string;
  course: ICourse;
  students: User[];
  progressableUnits: IUnit[] = [];
  progress: IProgress[];
  report: any[] = [];

  constructor(private route: ActivatedRoute,
              private courseService: CourseService,
              private unitService: UnitService,
              private progressService: ProgressService,
              private userService: UserService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = decodeURIComponent(params['id']);
    });
    this.getCourseAndStudents();
  }

  getCourseAndStudents() {
    this.courseService.readSingleItem(this.id)
    .then(
      (course: any) => {
        this.course = course;
        this.students = course.students.map((student) => new User(student));
        for (const lecture of course.lectures) {
          for (const unit of lecture.units) {
            if (unit.progressable) {
              this.progressableUnits.push(unit);
            }
          }
        }
      },
      (err: any) => {
        this.snackBar.open('Couldn\'t read course', '', {duration: 3000});
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
      this.students.map((student) => {
        const studentWithUnits: any = student;
        studentWithUnits.units = [];
        studentWithUnits.finishCount = 0;
        this.progressableUnits.map((progressableUnit) => {
          const unitWithProgress: any = progressableUnit;
          for (let i = 0; i < progress.length; i++) {
            if (studentWithUnits._id === progress[i].user && unitWithProgress._id === progress[i].unit) {
              unitWithProgress.progress = progress[i];
              if (unitWithProgress.progress.done) {
                studentWithUnits.finishCount++;
              }
              progress.splice(i, 1);
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
