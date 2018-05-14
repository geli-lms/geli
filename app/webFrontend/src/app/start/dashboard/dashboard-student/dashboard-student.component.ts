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
  filteredCourses: ICourseDashboard[];
  availableCoursesHolder: ICourseDashboard[];
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
    this.searchValue = event.target.value;
    this.availableCourses = this.availableCoursesHolder;
    this.filteredCourses = [];
    for (let i = 0; i < this.availableCourses.length; i++) {
      const temp = this.availableCourses[i].name.toLowerCase();
      if (temp.includes(event.target.value)) {
        this.filteredCourses.push(this.availableCourses[i]);
      }
    }
    this.availableCourses = this.filteredCourses;
  }
  async sortAlphabetically() {
    SortUtil.sortCoursesByName(this.myCourses);
    SortUtil.sortCoursesByName(this.availableCourses);
  }

  async sortCourses() {
    this.myCourses = [];
    this.availableCourses = [];
    this.availableCoursesHolder = [];

    SortUtil.sortByLastVisitedCourses(this.allCourses, this.userService.user.lastVisitedCourses);
    for (const course of this.allCourses) {
      if (course.userCanViewCourse) {
        this.myCourses.push(course);
      } else {
        this.availableCoursesHolder.push(course);
        const temp = course.name.toLowerCase();
        if (temp.includes(this.searchValue)) {
          this.availableCourses.push(course);
        }
      }
    }
  }
}
