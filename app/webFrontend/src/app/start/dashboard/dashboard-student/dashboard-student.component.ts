import {Component} from '@angular/core';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {UserService} from '../../../shared/services/user.service';
import {DashboardBaseComponent} from '../dashboard-base-component';
import {IStudentConfig} from '../../../../../../../shared/models/IStudentConfig';


@Component({
  selector: 'app-dashboard-student',
  templateUrl: './dashboard-student.component.html',
  styleUrls: ['./dashboard-student.component.scss']
})

export class DashboardStudentComponent extends DashboardBaseComponent {

  myCourses: ICourse[];
  availableCourses: ICourse[];
  studentConfig: IStudentConfig;

  constructor(public userService: UserService) {
    super();
  }

  ngOnInit() {

  }

  ngOnChanges() {
    this.sortCourses();
  }

  async sortCourses() {
    this.myCourses = [];
    this.availableCourses = [];

    for (const course of this.allCourses) {
      if (this.isMemberOfCourse(course)) {
        this.myCourses.push(course);
      } else {
        this.availableCourses.push(course);
      }
    }
    this.sortLastVisitedCourses();
  }
  sortLastVisitedCourses() {
     // console.log(this.myCourses);
    // for (const course of this.myCourses) {
      // const vCourse =
    // }
  }

  isMemberOfCourse(course: ICourse) {
    const user = this.userService.user;
    return course.students.filter(obj => obj._id === user._id).length > 0;
  }
}
