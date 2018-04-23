import {Component, OnInit} from '@angular/core';
import {UserService} from '../../shared/services/user.service';
import {CourseService, NotificationSettingsService} from '../../shared/services/data.service';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {MatSnackBar, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {
  INotificationSettings, NOTIFICATION_TYPE_ALL_CHANGES,
  NOTIFICATION_TYPE_NONE
} from '../../../../../../shared/models/INotificationSettings';
import {NotificationSettings} from '../../models/NotificationSettings';
import {isNullOrUndefined} from 'util';
import {AfterContentInit} from "@angular/core/src/metadata/lifecycle_hooks";

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit, AfterContentInit {

  myCourses: ICourse[];
  displayedColumns = ['name', 'Notifications', 'email'];
  dataSource: MatTableDataSource<ICourse>;
  notificationSelection = new SelectionModel<ICourse>(true, []);
  emailSelection = new SelectionModel<ICourse>(true, []);
  notificationSettings: INotificationSettings[];

  constructor(public userService: UserService,
              public courseService: CourseService,
              public notificationSettingsService: NotificationSettingsService,
              public snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.getCourses();
    this.getNotificationSettings().then(() => {
      this.setSelection();
    });
  }
    ngAfterContentInit(){
    this.getNotificationSettings().then(() => {
      this.setSelection();
    });
  }

  getCourses() {
    this.myCourses = [];
    this.courseService.readItems().then(courses => {
      courses.forEach((course: ICourse) => {
        if (this.userService.isMemberOfCourse(course)) {
          this.myCourses.push(course);
        }
      });
      this.dataSource = new MatTableDataSource<ICourse>(this.myCourses);
    });
  }

  async getNotificationSettings() {
    const settings = await this.notificationSettingsService.getNotificationSettingsPerUser(this.userService.user);
    if (settings.length <= 0) {
        await Promise.all(this.myCourses.map(async (course) => {
          const newSetting = await this.notificationSettingsService.createItem({user: this.userService.user, course: course});
          settings.push(newSetting);
        }));
    }
    this.notificationSettings = settings;
  }

  setSelection() {
    if (this.notificationSettings) {
      this.notificationSettings.forEach((setting: INotificationSettings) => {
        const courseWithNotificationSettings = this.myCourses.find(x => x._id === setting.course._id);
        if (courseWithNotificationSettings) {
          if (setting.notificationType === NOTIFICATION_TYPE_ALL_CHANGES) {
            this.notificationSelection.select(courseWithNotificationSettings);
          }
          if (setting.emailNotification) {
            this.emailSelection.select(courseWithNotificationSettings);
          }
        }
      });
    }
  }

  saveNotificationSettings() {
    try {
      this.myCourses.forEach(async course => {
        let settings: INotificationSettings;
        this.notificationSettings.forEach((x) => {
          if (x.course._id === course._id) {
            settings = x;
          }
        });
        if (settings === null || settings === undefined) {
          settings = await this.notificationSettingsService.createItem(new NotificationSettings(this.userService.user, course));
          this.notificationSettings.push(settings);
        }
        if (this.notificationSelection.isSelected(course)) {
          settings.notificationType = NOTIFICATION_TYPE_ALL_CHANGES;
        } else {
          settings.notificationType = NOTIFICATION_TYPE_NONE;
        }
        if (this.emailSelection.isSelected(course)) {
          settings.emailNotification = true;
        } else {
          settings.emailNotification = false;
        }
        await this.notificationSettingsService.updateItem(settings);
      });
      this.snackBar.open('Notification settings updated successfully.', '', {duration: 3000});
    } catch (error) {
      this.snackBar.open(error.message, 'Dismiss');
    }
  }

  isAllSelected(selectionModel: SelectionModel<ICourse>) {
    const numSelected = selectionModel.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(selectionModel: SelectionModel<ICourse>) {
    this.isAllSelected(selectionModel) ?
      selectionModel.clear() :
      this.dataSource.data.forEach(row => selectionModel.select(row));
  }


}
