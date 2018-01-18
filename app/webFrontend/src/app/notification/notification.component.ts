import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NotificationService, NotificationSettingsService, UserDataService} from '../shared/services/data.service';
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
       if (this.notifications.length > 0) {
         this.notificationIcon = NotificationIcon.ACTIVE;
       }
     });
  }

  isNullOrUndefined(item: any): boolean {
    if (item === null || item === undefined) {
      return true;
    }
    return false;
  }
}


