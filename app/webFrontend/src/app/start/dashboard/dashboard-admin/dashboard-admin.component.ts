import {Component} from '@angular/core';
import {DashboardBaseComponent} from '../dashboard-base-component';
import {SnackBarService} from '../../../shared/services/snack-bar.service';
import {DialogService} from '../../../shared/services/dialog.service';
import {Router} from '@angular/router';
import {SortUtil} from '../../../shared/utils/SortUtil';
import {ICourseDashboard} from '../../../../../../../shared/models/ICourseDashboard';
import {CourseNewComponent} from '../../../course/course-new/course-new.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent extends DashboardBaseComponent {

  fabOpen = false;
  allCoursesHolder: ICourseDashboard[];

  constructor(private snackBar: SnackBarService,
              private router: Router,
              private dialogService: DialogService,
              private dialog: MatDialog) {
    super();
  }

  ngOnInit() {
    this.allCoursesHolder = [];
  }

  async getInput(event: any) {
    if (this.allCoursesHolder.length === 0) {
      this.allCoursesHolder = this.allCourses;
    }
    const searchValue = event.target.value.toLowerCase();
    this.allCourses = [];
    super.filterCourses(searchValue, this.allCoursesHolder, this.allCourses);
  }

  closeFab = () => {
    this.fabOpen = false;
  }

  onFabClick = () => {
    this.fabOpen = !this.fabOpen;
  }

  onImportCourse = () => {
    this.dialogService
      .chooseFile('Choose a course.json to import',
        '/api/import/course/')
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

  createCourse() {
    this.onFabClick();
    this.dialog.open(CourseNewComponent, {
      width: '400px',
      maxWidth: '100%'}
    );
  }
}
