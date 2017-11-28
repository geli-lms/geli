import {Component} from '@angular/core';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {UserService} from '../../../shared/services/user.service';
import {DashboardBaseComponent} from '../dashboard-base-component';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {DialogService} from '../../../shared/services/dialog.service';

@Component({
  selector: 'app-dashboard-teacher',
  templateUrl: './dashboard-teacher.component.html',
  styleUrls: ['./dashboard-teacher.component.scss']
})
export class DashboardTeacherComponent extends DashboardBaseComponent {

  myCourses: ICourse[];
  furtherCourses: ICourse[];
  inactiveCourses: ICourse[];
  availableCourses: ICourse[];
  fabOpen = false;

  constructor(public userService: UserService,
              private router: Router,
              private dialogService: DialogService,
              private snackBar: MatSnackBar) {
    super();
  }

  ngOnChanges() {
    this.sortCourses();
  }

  sortCourses() {
    this.myCourses = [];
    this.availableCourses = [];
    this.furtherCourses = [];
    this.inactiveCourses = [];

    for (const course of this.allCourses) {
      if ((this.filterMyCourses(course) || this.filterAdminCourses(course)) && !course.active) {
        this.inactiveCourses.push(course);
      } else if (this.filterAdminCourses(course)) {
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

  closeFab = () => {
    this.fabOpen = false;
  };

  onFabClick = () => {
    this.fabOpen = !this.fabOpen;
  };

  onImportCourse = () => {
    this.dialogService
      .chooseFile('Choose a course.json to import',
        '/api/import/course/')
      .subscribe(res => {
        if (res.success) {
          this.snackBar.open('Course successfully imported', '', {duration: 3000});
          const url = '/course/' + res.result._id + '/edit';
          this.router.navigate([url]);
        } else if (res.result) {
          this.snackBar.open(res.result.message, '', {duration: 3000});
        }
      });
  };
}
