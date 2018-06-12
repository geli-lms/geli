import {Component} from '@angular/core';
import {ICourseDashboard} from '../../../../../../../shared/models/ICourseDashboard';
import {UserService} from '../../../shared/services/user.service';
import {DashboardBaseComponent} from '../dashboard-base-component';
import {SnackBarService} from '../../../shared/services/snack-bar.service';
import {Router} from '@angular/router';
import {DialogService} from '../../../shared/services/dialog.service';
import {SortUtil} from '../../../shared/utils/SortUtil';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {CourseNewComponent} from '../../../course/course-new/course-new.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard-teacher',
  templateUrl: './dashboard-teacher.component.html',
  styleUrls: ['./dashboard-teacher.component.scss']
})
export class DashboardTeacherComponent extends DashboardBaseComponent {

  myCourses: ICourseDashboard[];
  myCoursesHolder: ICourseDashboard[];
  furtherCourses: ICourseDashboard[];
  furtherCoursesHolder: ICourseDashboard[];
  inactiveCourses: ICourseDashboard[];
  inactiveCoursesHolder: ICourseDashboard[];
  availableCourses: ICourseDashboard[];
  availableCoursesHolder: ICourseDashboard[];
  searchValue: string;
  fabOpen = false;

  constructor(public userService: UserService,
              private router: Router,
              private dialogService: DialogService,
              private snackBar: SnackBarService,
              private dialog: MatDialog,
              private translate:  TranslateService) {
    super();
  }

  ngOnChanges() {
    this.sortCourses();
  }

  ngOnInit() {
    this.searchValue = '';
    this.myCoursesHolder = [];
    this.availableCoursesHolder = [];
    this.furtherCoursesHolder = [];
    this.inactiveCoursesHolder = [];
  }

  async getInput(event: any) {
    if (this.myCoursesHolder.length === 0) {
      this.myCoursesHolder = this.myCourses;
    }
    if (this.availableCoursesHolder.length === 0) {
      this.availableCoursesHolder = this.availableCourses;
    }
    if (this.furtherCoursesHolder.length === 0) {
      this.furtherCoursesHolder = this.furtherCourses;
    }
    if (this.inactiveCoursesHolder.length === 0) {
      this.inactiveCoursesHolder = this.inactiveCourses;
    }
    const searchValue = event.target.value.toLowerCase();
    this.myCourses = [];
    this.availableCourses = [];
    this.furtherCourses = [];
    this.inactiveCourses = [];
    super.filterCourses(searchValue, this.myCoursesHolder, this.myCourses);
    super.filterCourses(searchValue, this.availableCoursesHolder, this.availableCourses);
    super.filterCourses(searchValue, this.furtherCoursesHolder, this.furtherCourses);
    super.filterCourses(searchValue, this.inactiveCoursesHolder, this.inactiveCourses);
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
    this.translate.get(['snackbarMessages.chooseJson', 'snackbarMessages.importSuccess']).subscribe((t: string) => {
      this.dialogService
        .chooseFile(t['snackbarMessages.chooseJson'],
          '/api/import/course/')
        .subscribe(res => {
          if (res.success) {
            this.snackBar.open(t['snackbarMessages.importSuccess']);
            const url = '/course/' + res.result._id + '/edit';
            this.router.navigate([url]);
          } else if (res.result) {
            this.snackBar.open(res.result.message);
          }
        });
    });
  }

  createCourse() {
    this.onFabClick();
    this.dialog.open(CourseNewComponent, {
      width: '400px',
      maxWidth: '100%'}
    );
  }
}
