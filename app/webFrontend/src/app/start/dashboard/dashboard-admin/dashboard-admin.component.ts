import {Component} from '@angular/core';
import {DashboardBaseComponent} from '../dashboard-base-component';
import {MatSnackBar} from '@angular/material';
import {DialogService} from '../../../shared/services/dialog.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent extends DashboardBaseComponent {

  fabOpen = false;

  constructor(private snackBar: MatSnackBar,
              private router: Router,
              private dialogService: DialogService) {
    super();
  }

  ngOnInit() {
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
