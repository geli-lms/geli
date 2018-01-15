import { Component, OnInit } from '@angular/core';
import {UserService} from '../../shared/services/user.service';
import {CourseService, NotificationSettingsService} from '../../shared/services/data.service';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {MatSnackBar, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {
  INotificationSettings, NOTIFICATION_TYPE_ALL_CHANGES,
  NOTIFICATION_TYPE_NONE
} from '../../../../../../shared/models/INotificationSettings';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {

  myCourses: ICourse[];
  displayedColumns = ['name', 'Notifications'];
  dataSource: MatTableDataSource<ICourse>;
  selection = new SelectionModel<ICourse>(true, []);
  notificationSettings: INotificationSettings[];

  constructor(public userService: UserService,
              public courseService: CourseService,
              public notificationSettingsService: NotificationSettingsService,
              public snackBar: MatSnackBar) {

  }

  ngOnInit() {
    this.getCourses();
    this.setSelection();
  }

  getCourses() {
    this.myCourses = [];
    this.courseService.readItems().then(courses => {
      courses.forEach(course => {
        if (this.userService.isMemberOfCourse(course)) {
          this.myCourses.push(course);
        }
      });
      this.dataSource = new MatTableDataSource<ICourse>(this.myCourses);
    })
  }

  setSelection() {
    this.notificationSettingsService.getNotificationSettingsPerUser(this.userService.user).then(settings => {
      this.notificationSettings = settings;
      settings.forEach((setting: INotificationSettings) => {
        if (setting.notificationType === NOTIFICATION_TYPE_ALL_CHANGES) {
          const courseWithNotificationSettings = this.myCourses.find(x => x._id === setting.course._id);
          if (courseWithNotificationSettings) {
            this.selection.select(courseWithNotificationSettings);
          }
        }
      })
    });
  }

  saveNotifications () {
    try {
      this.myCourses.forEach(course => {
        let settings: INotificationSettings;
        this.notificationSettings.forEach((x) => {
         if (x.course._id === course._id) {
           settings = x;
         }
        });
        if (this.selection.isSelected(course)) {
         settings.notificationType = NOTIFICATION_TYPE_ALL_CHANGES;
        } else {
         settings.notificationType = NOTIFICATION_TYPE_NONE;
        }
        this.notificationSettingsService.updateItem(settings);
      });
      this.snackBar.open('Notifications successfully updated.', '', {duration: 3000});
    } catch (error) {
      this.snackBar.open(error.json().message, 'Dismiss');
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }


}
