import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UserService} from '../../shared/services/user.service';
import {CourseService} from '../../shared/services/data.service';
import {Router} from '@angular/router';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {IUser} from '../../../../../../shared/models/IUser';

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
  }

  ngOnInit() {
    this.getCourses();
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

  isMemberOfCourse(students: IUser[]) {
    const user = this.userService.user;
    return students.filter(obj => obj._id === user._id).length > 0;
  }

}
