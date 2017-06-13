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
  students: User[];
  progressableUnits: IUnit[];
  progress: any;

  constructor(private route: ActivatedRoute,
              private courseService: CourseService,
              private unitService: UnitService,
              private progressService: ProgressService) { }

  ngOnInit() {
    this.route.params.subscribe(params => { this.id = decodeURIComponent(params['id']); });
    this.getCourseAndStudents();
    this.getProgress();
    // this.getProgressableUnits();
  }

  getCourseAndStudents() {
    this.courseService.readSingleItem(this.id)
      .then(
        (course: any) => {
          this.course = course;
          this.students = course.students;
        },
        (err: any) => {
          console.log(err);
      });
  }

  getProgressableUnits() {
    this.unitService.getProgressableUnits(this.id)
      .then(
        (progressableUnits) => {
          this.progressableUnits = progressableUnits;
        },
        (err) => {
          console.log(err);
        });
  }

  getProgress() {
    this.progressService.getCourseProgress(this.id)
      .then((progress: any) => {
        this.progress = progress;
      });
  }

}
