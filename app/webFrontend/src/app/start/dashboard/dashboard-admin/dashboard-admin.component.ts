import {Component} from '@angular/core';
import {DashboardBaseComponent} from '../dashboard-base-component';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent extends DashboardBaseComponent {

  fabOpen = false;

  constructor(private snackBar: MatSnackBar) {
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
    this.snackBar.open('Not jet implemented', '', {duration: 3000});
  };
}
