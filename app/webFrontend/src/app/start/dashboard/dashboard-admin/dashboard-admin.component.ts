import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {MatDialog, MatSnackBar} from '@angular/material';
import {UserService} from '../../../shared/services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent implements OnInit {

  @Input()
  allCourses: ICourse[];

  @Output()
  onEnroll = new EventEmitter();

  constructor(public userService: UserService,
              private router: Router,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
  }

  enrollCallback() {
    this.onEnroll.emit();
  }


}
