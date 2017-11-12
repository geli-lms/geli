import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {MatDialog, MatSnackBar} from '@angular/material';
import {UserService} from '../../../shared/services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard-teacher',
  templateUrl: './dashboard-teacher.component.html',
  styleUrls: ['./dashboard-teacher.component.scss']
})
export class DashboardTeacherComponent implements OnInit {

  @Input()
  allCourses: ICourse[];

  myCourses: ICourse[];
  furtherCourses: ICourse[];
  availableCourses: ICourse[];

  @Output()
  onEnroll = new EventEmitter();

  constructor(public userService: UserService,
              private router: Router,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {
    this.myCourses = [];
    this.furtherCourses = [];
    this.availableCourses = [];
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.sortCourses();
  }

  sortCourses() {
    this.myCourses = [];
    this.availableCourses = [];
    this.furtherCourses = [];

    for (const course of this.allCourses) {
      if (this.filterAdminCourses(course)) {
        this.myCourses.push(course);
      } else if (this.filterMyCourses(course)) {
        this.furtherCourses.push(course);
      } else {
        this.availableCourses.push(course);
      }
    }
  }

  filterAdminCourses(course: ICourse) {
    return (course.courseAdmin._id === this.userService.user._id);
  }

  filterMyCourses(course: ICourse) {
    return course.teachers.filter(teacher => teacher._id === this.userService.user._id);
  }

}
