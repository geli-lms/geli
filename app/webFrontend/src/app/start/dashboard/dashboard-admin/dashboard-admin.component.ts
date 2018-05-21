import {Component} from '@angular/core';
import {DashboardBaseComponent} from '../dashboard-base-component';
import {SnackBarService} from '../../../shared/services/snack-bar.service';
import {DialogService} from '../../../shared/services/dialog.service';
import {Router} from '@angular/router';
import {SortUtil} from "../../../shared/utils/SortUtil";
import {ICourseDashboard} from "../../../../../../../shared/models/ICourseDashboard";

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent extends DashboardBaseComponent {

  fabOpen = false;
  searchValue: string;
  allCoursesAdmin: ICourseDashboard[];

  constructor(private snackBar: SnackBarService,
              private router: Router,
              private dialogService: DialogService) {
    super();
  }

  ngOnInit() {
    this.searchValue = '';
    this.allCoursesAdmin = [];
  }

  async filterCourses(event: any) {
    this.searchValue = event.target.value.toLowerCase();
    if (this.allCoursesAdmin.length == 0) {
      this.allCoursesAdmin = this.allCourses;
    }
    this.allCourses = [];
    for (const course of this.allCoursesAdmin) {
      const temp = course.name.toLowerCase();
      if (temp.includes(this.searchValue)) {
        this.allCourses.push(course);
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
}
