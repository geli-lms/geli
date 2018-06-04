import {Component} from '@angular/core';
import {ICourseDashboard} from '../../../../../../../shared/models/ICourseDashboard';
import {UserService} from '../../../shared/services/user.service';
import {DashboardBaseComponent} from '../dashboard-base-component';
import {SortUtil} from '../../../shared/utils/SortUtil';
import {TranslateService} from '@ngx-translate/core';
import {CourseNewComponent} from '../../../course/course-new/course-new.component';
import {MatDialog} from '@angular/material';


@Component({
  selector: 'app-dashboard-student',
  templateUrl: './dashboard-student.component.html',
  styleUrls: ['./dashboard-student.component.scss']
})
export class DashboardStudentComponent extends DashboardBaseComponent {

  myCourses: ICourseDashboard[];
  myCoursesHolder: ICourseDashboard[];
  availableCourses: ICourseDashboard[];
  availableCoursesHolder: ICourseDashboard[];
  searchValue: string;

  constructor(public userService: UserService) {
    super();
  }

  ngOnInit() {
    this.searchValue = '';
    this.myCoursesHolder = [];
    this.availableCoursesHolder = [];
  }

  async getInput(event: any) {
    if (this.myCoursesHolder.length === 0) {
      this.myCoursesHolder = this.myCourses;
    }
    if (this.availableCoursesHolder.length === 0) {
      this.availableCoursesHolder = this.availableCourses;
    }
    const searchValue = event.target.value.toLowerCase();
    this.myCourses = [];
    this.availableCourses = [];
    super.filterCourses(searchValue, this.myCoursesHolder, this.myCourses);
    super.filterCourses(searchValue, this.availableCoursesHolder, this.availableCourses);
  }

  ngOnChanges() {
    this.sortCourses();
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
