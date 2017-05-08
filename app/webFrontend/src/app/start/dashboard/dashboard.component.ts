import {Component, OnInit, ViewEncapsulation} from '@angular/core';
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
              private router: Router) {
    this.getCourses();
  }

  ngOnInit() {

  }

  getCourses() {
    this.courseService.readItems().then(courses => {
      this.allCourses = courses;
    });
  }

  editCourse(id: string) {
    const url = '/course/edit/' + id;
    this.router.navigate([url]);
  }

  apply(courseId: string) {
    this.courseService.enrollStudent(courseId, this.userService.user);
  }

  goToInfo(course: string) {
    const url = '/course/detail/' + course;
    this.router.navigate([url]);
  }

}
