import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../shared/services/data.service';
import {INotification} from '../../../../../shared/models/INotification';
import {UserService} from '../shared/services/user.service';

enum NotificationIcon {
  NOTIFICATIONS = 'notifications',
  ACTIVE = 'notifications_active',
  NONE = 'notifications_none',
  OFF = 'notifications_off',
  PAUSED = 'notifications_paused',
}

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  notificationIcon: NotificationIcon;
  notifications: Array<INotification>;

  constructor(private notificationService: NotificationService,
              private userService: UserService) {
    this.notificationIcon = NotificationIcon.NONE;
    this.getNotifications();
  }

  ngOnInit() {
  }

  getNotifications() {
    this.notificationService.getNotificationsPerUser(this.userService.user).then(notifications => {
      this.notifications = notifications.reverse();
      this.sortNotifications();
      if (this.notifications.length > 0) {
        this.notificationIcon = NotificationIcon.ACTIVE;
      }
    });
  }

  async clearAll() {
    await Promise.all(this.notifications.map(async notification => {
      await this.removeNotification(notification);
    }));
    this.notifications = [];
  }

  async removeNotification(notification: INotification) {
    const index = this.notifications.indexOf(notification);
    this.notifications.splice(index, 1);
    await this.notificationService.deleteItem(notification);
  }

  sortNotifications() {
    this.notifications = this.notifications.sort((a, b) => {
      if (compareIds(a.changedCourse, b.changedCourse) === 0) {
        if (!(a.changedLecture === null || a.changedLecture === undefined)
          && !(b.changedLecture === null || b.changedLecture === undefined)) {
          if (compareIds(a.changedLecture, b.changedLecture) === 0) {
            if (!(a.changedUnit === null || a.changedUnit === undefined)
              && !(b.changedUnit === null || b.changedUnit === undefined)) {
              return compareIds(a.changedUnit, b.changedUnit);
            }
          }
          return compareIds(a.changedLecture, b.changedLecture);
        }
      }
      return compareIds(a.changedCourse, b.changedCourse);
    });
  }

  isNullOrUndefined(item: any): boolean {
    if (item === null || item === undefined) {
      return true;
    }
    return false;
  }
}

function compareIds(a: any, b: any) {
  if (a._id > b._id) {
    return 1;
  }
  if (a._id < b._id) {
    return -1;
  }
  return 0;
};
