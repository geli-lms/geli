import {Component} from '@angular/core';
import {ICourseDashboard} from '../../../../../../../shared/models/ICourseDashboard';
import {UserService} from '../../../shared/services/user.service';
import {DashboardBaseComponent} from '../dashboard-base-component';
import {SortUtil} from '../../../shared/utils/SortUtil';


@Component({
  selector: 'app-dashboard-student',
  templateUrl: './dashboard-student.component.html',
  styleUrls: ['./dashboard-student.component.scss']
})
export class DashboardStudentComponent extends DashboardBaseComponent {

  myCourses: ICourseDashboard[];
  availableCourses: ICourseDashboard[];
  searchValue: string;

  constructor(public userService: UserService) {
    super();
  }

  ngOnInit() {
    this.searchValue = '';
  }

  ngOnChanges() {
    this.sortCourses();
  }

  async filterCourses(event: any) {
    this.myCourses = [];
    this.availableCourses = [];
    this.searchValue = event.target.value.toLowerCase();
    for (const course of this.allCourses) {
      const temp = course.name.toLowerCase();
      if (course.userCanViewCourse) {
        if (temp.includes(this.searchValue)) {
          this.myCourses.push(course);
        }
      } else {
        if (temp.includes(this.searchValue)) {
          this.availableCourses.push(course);
        }
      }
    }
  }

  async sortAlphabetically() {
    SortUtil.sortCoursesByName(this.myCourses);
    SortUtil.sortCoursesByName(this.availableCourses);
  }

  async sortCourses() {
    this.myCourses = [];
    this.availableCourses = [];

    SortUtil.sortByLastVisitedCourses(this.allCourses, this.userService.user.lastVisitedCourses);
    for (const course of this.allCourses) {
      const temp = course.name.toLowerCase();
      if (course.userCanViewCourse) {
        if (temp.includes(this.searchValue)) {
          this.myCourses.push(course);
        }
      } else {
        if (temp.includes(this.searchValue)) {
          this.availableCourses.push(course);
        }
      }
    }
  }
}
