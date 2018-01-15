import { Component, OnInit } from '@angular/core';
import {UserService} from '../../shared/services/user.service';
import {CourseService, NotificationSettingsService} from '../../shared/services/data.service';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {MatTableDataSource} from '@angular/material';
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
              public notificationSettingsService: NotificationSettingsService) {

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

  // TODO: Fix: bei myCourse.find wird nur geschaut, ob es settings gibt.
  // es muss aber geschaut werden, ob der notificationType = all_changes ist.
  setSelection() {
    this.notificationSettingsService.getNotificationSettingsPerUser(this.userService.user).then(settings => {
      this.notificationSettings = settings;
      settings.forEach((setting: INotificationSettings) => {
        const courseWithNotificationSettings = this.myCourses.find(x => x._id === setting.course._id);
        if (courseWithNotificationSettings) {
          this.selection.select(courseWithNotificationSettings);
        }
      })
    });
  }

  saveNotifications () {
    this.myCourses.forEach(course => {
      // const settings = this.notificationSettings.find((x: INotificationSettings) => x.course === course);
      let settings: INotificationSettings;
      this.notificationSettings.forEach((x) => {
        if (x.course._id === course._id) {
          settings = x;
        }
      })
      if (this.selection.isSelected(course)) {
        settings.notificationType = NOTIFICATION_TYPE_ALL_CHANGES;
      } else {
        settings.notificationType = NOTIFICATION_TYPE_NONE;
      }
      this.notificationSettingsService.updateItem(settings);
    })
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
