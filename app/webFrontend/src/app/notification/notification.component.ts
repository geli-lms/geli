import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NotificationService, NotificationSettingsService, UserDataService} from '../shared/services/data.service';
import {INotification} from '../../../../../shared/models/INotification';
import {UserService} from '../shared/services/user.service';
import {ICourse} from '../../../../../shared/models/ICourse';
import {ILecture} from '../../../../../shared/models/ILecture';
import {IUnit} from '../../../../../shared/models/units/IUnit';

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

  sortNotifications() {
    this.notifications = this.notifications.sort(function(a, b) {
      if (a.changedCourse._id > b.changedCourse._id) {
        return 1;
      }
      if (a.changedCourse._id < b.changedCourse._id) {
        return -1;
      }
      return 0;
    });
    this.notifications = this.notifications.sort(function(a, b) {
      if (!(a.changedLecture === null || a.changedLecture === undefined)
        && !(b.changedLecture === null || b.changedLecture === undefined)) {
        if (a.changedLecture._id > b.changedLecture._id) {
          return 1;
        }
        if (a.changedLecture._id < b.changedLecture._id) {
          return -1;
        }
      }
      return 0;
    });
    this.notifications = this.notifications.reverse();
  }

  sortUndefined(a: any) {
    if (this.isNullOrUndefined(a)) {
      return -1;
    }
    return 1;
  }

  compareUnit (a: IUnit, b: IUnit) {
    if (a._id > b._id) {
      return 1;
    }
    if (a._id < b._id) {
      return -1;
    }
    return 0;
  }

  compareLecture (a: ILecture, b: ILecture) {
    if (a._id > b._id) {
      return 1;
    }
    if (a._id < b._id) {
      return -1;
    }
    return 0;
  }
  compareCourse (a: ICourse, b: ICourse) {
    if (a._id > b._id) {
      return 1;
    }
    if (a._id < b._id) {
      return -1;
    }
    return 0;
  }

  compareNotificationDate (a: any, b: any) {
    if (a.createdAt > b.createdAt) {
      return 1;
    }
    if (a.createdAt < b.createdAt) {
      return -1;
    }
    return 0;
  }

  isNullOrUndefined(item: any): boolean {
    if (item === null || item === undefined) {
      return true;
    }
    return false;
  }
}


