import {Component} from '@angular/core';
import {ICourseDashboard} from '../../../../../../../shared/models/ICourseDashboard';
import {UserService} from '../../../shared/services/user.service';
import {DashboardBaseComponent} from '../dashboard-base-component';
import {SnackBarService} from '../../../shared/services/snack-bar.service';
import {Router} from '@angular/router';
import {DialogService} from '../../../shared/services/dialog.service';
import {SortUtil} from '../../../shared/utils/SortUtil';

@Component({
  selector: 'app-dashboard-teacher',
  templateUrl: './dashboard-teacher.component.html',
  styleUrls: ['./dashboard-teacher.component.scss']
})
export class DashboardTeacherComponent extends DashboardBaseComponent {

  myCourses: ICourseDashboard[];
  furtherCourses: ICourseDashboard[];
  inactiveCourses: ICourseDashboard[];
  availableCourses: ICourseDashboard[];
  searchValue: string;
  fabOpen = false;

  constructor(public userService: UserService,
              private router: Router,
              private dialogService: DialogService,
              private snackBar: SnackBarService) {
    super();
  }

  ngOnChanges() {
    this.sortCourses();
  }

  ngOnInit() {
    this.searchValue = '';
  }

  async filterCourses(event: any) {
    this.myCourses = [];
    this.availableCourses = [];
    this.furtherCourses = [];
    this.inactiveCourses = [];
    this.searchValue = event.target.value.toLowerCase();
    for (const course of this.allCourses) {
      const temp = course.name.toLowerCase();
      if (temp.includes(this.searchValue)) {
        if (course.userIsCourseAdmin || course.userIsCourseTeacher) {
          if (!course.active) {
            this.inactiveCourses.push(course);
          } else if (course.userIsCourseAdmin) {
            this.myCourses.push(course);
          } else {
            this.furtherCourses.push(course);
          }
        } else {
          this.availableCourses.push(course);
        }
      }
    }
  }

  async sortAlphabetically() {
    SortUtil.sortCoursesByName(this.myCourses);
    SortUtil.sortCoursesByName(this.availableCourses);
    SortUtil.sortCoursesByName(this.furtherCourses);
    SortUtil.sortCoursesByName(this.inactiveCourses);

  }

  sortCourses() {
    this.myCourses = [];
    this.availableCourses = [];
    this.furtherCourses = [];
    this.inactiveCourses = [];
    SortUtil.sortByLastVisitedCourses(this.allCourses, this.userService.user.lastVisitedCourses);
    for (const course of this.allCourses) {
      const temp = course.name.toLowerCase();
      if (temp.includes(this.searchValue)) {
        if (course.userIsCourseAdmin || course.userIsCourseTeacher) {
          if (!course.active) {
            this.inactiveCourses.push(course);
          } else if (course.userIsCourseAdmin) {
            this.myCourses.push(course);
          } else {
            this.furtherCourses.push(course);
          }
        } else {
          this.availableCourses.push(course);
        }
      }
    }
  }

  closeFab = () => {
    this.fabOpen = false;
  }

  onFabClick = () => {
    this.fabOpen = !this.fabOpen;
  }

  onImportCourse = () => {
    this.dialogService
      .chooseFile('Choose a course.json to import', '/api/import/course/')
      .subscribe(res => {
        if (res.success) {
          this.snackBar.open('Course successfully imported');
          const url = '/course/' + res.result._id + '/edit';
          this.router.navigate([url]);
        } else if (res.result) {
          this.snackBar.open(res.result.message);
        }
      });
  }
}
