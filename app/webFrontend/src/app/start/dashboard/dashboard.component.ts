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

  // UserService for HTML page
  constructor(public userService: UserService,
              private courseService: CourseService,
              private router: Router,
              private dialog: MdDialog,
              private snackBar: MdSnackBar) {
  }

  ngOnInit() {
    this.getCourses();
  }

  getCourses() {
    this.courseService.readItems().then(courses => {
      this.allCourses = courses;
    });
  }

  enrollCallback({courseId, accessKey}) {
    this.courseService.enrollStudent(courseId, {
      user: this.userService.user,
      accessKey
    }).then((res) => {
      this.snackBar.open('Successfully enrolled', '', {duration: 5000});
      // reload courses to update enrollment status
      this.getCourses();
    }).catch((err) => {
      this.snackBar.open(`${err.statusText}: ${JSON.parse(err._body).message}`, '', {duration: 5000});
    });
  }
}
