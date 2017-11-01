import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MdDialog, MdSnackBar} from '@angular/material';
import {UserService} from '../../shared/services/user.service';
import {CourseService} from '../../shared/services/data.service';
import {Router} from '@angular/router';
import {ICourse} from '../../../../../../shared/models/ICourse';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  allCourses: ICourse[];
  myCourses: ICourse[];
  availableCourses: ICourse[];

  // UserService for HTML page
  constructor(public userService: UserService,
              private courseService: CourseService,
              private router: Router,
              private dialog: MdDialog,
              private snackBar: MdSnackBar) {
  }

  ngOnInit() {
    this.myCourses = [];
    this.availableCourses = [];
    this.getCourses();
  }

  getCourses() {
    this.myCourses = [];
    this.availableCourses = [];
    this.courseService.readItems().then(courses => {
      this.allCourses = courses;
      for (const course of courses) {
        if (this.isMemberOfCourse(course) || this.isCourseTeacherOrAdmin(course)) {
          this.myCourses.push(course);
        } else {
          this.availableCourses.push(course);
        }
      }
    });
  }

  enrollCallback() {
      this.getCourses();
  }

  isCourseTeacherOrAdmin(course: ICourse) {
    if (this.userService.isAdmin()) {
      return true;
    }

    return (course.courseAdmin && course.courseAdmin._id === this.userService.user._id) ||
      course.teachers.filter(teacher => teacher._id === this.userService.user._id).length;
  }

  isMemberOfCourse(course: ICourse) {
    const user = this.userService.user;
    return this.userService.isStudent() &&
      course.students.filter(obj => obj._id === user._id).length > 0;
  }
}
