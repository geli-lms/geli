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
  availableCourses: ICourseDashboard[];

  constructor(public userService: UserService) {
    super();
  }

  ngOnInit() {
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
      if (course.userCanViewCourse) {
        this.myCourses.push(course);
      } else {
        this.availableCourses.push(course);
      }
    }
  }
}
