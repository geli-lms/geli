import {Component} from '@angular/core';
import {DashboardBaseComponent} from '../dashboard-base-component';
import {SnackBarService} from '../../../shared/services/snack-bar.service';
import {DialogService} from '../../../shared/services/dialog.service';
import {Router} from '@angular/router';
import {SortUtil} from '../../../shared/utils/SortUtil';
import {ICourseDashboard} from '../../../../../../../shared/models/ICourseDashboard';
import {CourseNewComponent} from '../../../course/course-new/course-new.component';
import {MatDialog} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {UserService} from '../../../shared/services/user.service';


@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent extends DashboardBaseComponent {

  fabOpen = false;
  allCoursesHolder: ICourseDashboard[];

  constructor(private snackBar: SnackBarService,
              public userService: UserService,
              private router: Router,
              private dialogService: DialogService,
              private dialog: MatDialog,
              public translate: TranslateService) {
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
    const lang = localStorage.getItem('lang') || this.translate.getBrowserLang() || this.translate.getDefaultLang();
    this.translate.use(lang);
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
  ngOnChanges() {
    this.sortCourses();
  }

  async sortAlphabetically() {
    SortUtil.sortCoursesByName(this.allCoursesHolder);
  }

  async sortCourses() {
    this.allCoursesHolder = [];

    SortUtil.sortByLastVisitedCourses(this.allCourses, this.userService.user.lastVisitedCourses);
    this.allCoursesHolder = this.allCourses;
  }
}
