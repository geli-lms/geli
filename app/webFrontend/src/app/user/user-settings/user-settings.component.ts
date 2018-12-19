import {Component, OnInit} from '@angular/core';
import {UserService} from '../../shared/services/user.service';
import {CourseService, NotificationSettingsService} from '../../shared/services/data.service';
import {MatTableDataSource} from '@angular/material';
import {SnackBarService} from '../../shared/services/snack-bar.service';
import {SelectionModel} from '@angular/cdk/collections';
import {
  INotificationSettings,
  NOTIFICATION_TYPE_ALL_CHANGES,
  NOTIFICATION_TYPE_NONE
} from '../../../../../../shared/models/INotificationSettings';
import {NotificationSettings} from '../../models/NotificationSettings';
import {ICourseDashboard} from '../../../../../../shared/models/ICourseDashboard';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {

  myCourses: ICourseDashboard[];
  displayedColumns = ['name', 'Notifications', 'email'];
  dataSource: MatTableDataSource<ICourseDashboard>;
  notificationSelection = new SelectionModel<ICourseDashboard>(true, []);
  emailSelection = new SelectionModel<ICourseDashboard>(true, []);
  notificationSettings: INotificationSettings[];

  constructor(private userService: UserService,
              private courseService: CourseService,
              private notificationSettingsService: NotificationSettingsService,
              private snackBar: SnackBarService) {
  }

  async ngOnInit() {
    await this.getCourses();
    await this.getNotificationSettings();
    this.setSelection();
  }

  async getCourses() {
    this.myCourses = [];
    try {
      this.myCourses = (await this.courseService.readItems<ICourseDashboard>())
        .filter((course: ICourseDashboard) => course.userIsCourseMember);
      this.dataSource = new MatTableDataSource<ICourseDashboard>(this.myCourses);
    } catch (err) {
      this.snackBar.open('Could not fetch courses');
    }
  }

  async getNotificationSettings() {
    this.notificationSettings = await this.notificationSettingsService.getNotificationSettings();
  }

  setSelection() {
    if (!this.notificationSettings) {
      return;
    }

    this.notificationSettings.forEach((setting: INotificationSettings) => {
      const course = this.myCourses.find(tmp => tmp._id === setting.course._id);

      if (course === undefined) {
        return;
      }

      if (setting.notificationType === NOTIFICATION_TYPE_ALL_CHANGES) {
        this.notificationSelection.select(course);
      }

      if (setting.emailNotification) {
        this.emailSelection.select(course);
      }
    });
  }

  async saveNotificationSettings() {
    const errors = [];

    for (const course of this.myCourses) {
      try {
        let settings = this.notificationSettings.find(tmp => tmp.course._id === course._id);

        if (settings === undefined) {
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
      } catch (err) {
        if (errors.indexOf(err.error.message) === -1) {
          errors.push(err.error.message);
        }
      }
    }

    if (errors.length === 0) {
      this.snackBar.open('Notification settings updated successfully.');
    } else {
      this.snackBar.openLong('Failed to save notification settings: ' + errors.join(', '));
    }
  }

  isAllSelected(selectionModel: SelectionModel<ICourseDashboard>) {
    return selectionModel.selected.length === this.dataSource.data.length;
  }

  masterToggle(selectionModel: SelectionModel<ICourseDashboard>) {
    this.isAllSelected(selectionModel)
      ? selectionModel.clear()
      : this.dataSource.data.forEach(row => selectionModel.select(row));
  }
}
