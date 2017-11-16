import {Component} from '@angular/core';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {UserService} from '../../../shared/services/user.service';
import {DashboardBaseComponent} from '../dashboard-base-component';

@Component({
  selector: 'app-dashboard-teacher',
  templateUrl: './dashboard-teacher.component.html',
  styleUrls: ['./dashboard-teacher.component.scss']
})
export class DashboardTeacherComponent extends DashboardBaseComponent {

  myCourses: ICourse[];
  furtherCourses: ICourse[];
  availableCourses: ICourse[];

  constructor(public userService: UserService) {
    super();
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
    return (course.teachers.filter(teacher => teacher._id === this.userService.user._id).length);
  }
}
