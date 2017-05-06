import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UserService} from '../shared/user.service';
import {CourseService} from '../shared/data.service';
import {Router} from '@angular/router';
import {ICourse} from '../../../../../shared/models/ICourse';

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

  getAllCourses(): ICourse[] {
    return this.allCourses;
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
    console.log('apply');
    this.courseService.enrollStudent(courseId, {'_id': this.userService.getCurrentUserId()});
  }

  goToInfo(course: string) {
    const url = '/course/detail/' + course;
    this.router.navigate([url]);
  }

}
