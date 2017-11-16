import {Component} from '@angular/core';
import {DashboardBaseComponent} from '../dashboard-base-component';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent extends DashboardBaseComponent {

  constructor() {
    super();
  }

  ngOnInit() {
  }
}
