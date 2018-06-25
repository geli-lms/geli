import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../shared/services/data.service';
import {INotification} from '../../../../../shared/models/INotification';
import {UserService} from '../shared/services/user.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  notifications: Array<INotification>;

  constructor(private notificationService: NotificationService,
              private userService: UserService) {
    this.getNotifications();
  }

  ngOnInit() {
  }

  async getNotifications() {
    this.notifications = await this.notificationService.getNotificationsPerUser(this.userService.user);
    this.sortNotifications();
  }

  async clearAll() {
    await Promise.all(this.notifications.map(async notification => {
      await this.notificationService.deleteItem(notification);
    }));
    this.notifications = [];
  }

  async removeNotification(notification: INotification) {
    const index = this.notifications.indexOf(notification);
    this.notifications.splice(index, 1);
    await this.notificationService.deleteItem(notification);
  }

  /**
   * Sorts notifications: at first by the courseID, then by lectureID (if the notification has a reference to it)
   * and then by the unit (again only if available).
   */
  sortNotifications() {
    this.notifications = this.notifications.sort((a, b) => {
        if (!(a.changedCourse === null || a.changedCourse === undefined)
          && !(b.changedCourse === null || b.changedCourse === undefined)) {
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
        }
      }
    );
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
}

