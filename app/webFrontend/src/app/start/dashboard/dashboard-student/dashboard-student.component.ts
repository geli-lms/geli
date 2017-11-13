import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {MatDialog, MatSnackBar} from '@angular/material';
import {UserService} from '../../../shared/services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard-student',
  templateUrl: './dashboard-student.component.html',
  styleUrls: ['./dashboard-student.component.scss']
})
export class DashboardStudentComponent implements OnInit {

  @Input()
  allCourses: ICourse[];

  myCourses: ICourse[];
  availableCourses: ICourse[];

  @Output()
  onEnroll = new EventEmitter();

  constructor(public userService: UserService,
              private router: Router,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {
    this.myCourses = [];
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
    for (const course of this.allCourses) {
      if (this.isMemberOfCourse(course)) {
        this.myCourses.push(course);
      } else {
        this.availableCourses.push(course);
      }
    }
  }

  isMemberOfCourse(course: ICourse) {
    const user = this.userService.user;
    return course.students.filter(obj => obj._id === user._id).length > 0;
  }

  enrollCallback() {
    this.onEnroll.emit();
  }
}
