import {Component, OnInit} from '@angular/core';
import {NotificationSettingsService} from '../../services/data.service';

@Component({
  selector: 'app-notification-menu',
  templateUrl: './notification-menu.component.html',
  styleUrls: ['./notification-menu.component.scss']
})
export class NotificationMenuComponent implements OnInit {

  notificationType: NotificationIcon;
  notifications: Array<String> =
    ['test1', 'test2', 'test1', 'test2', 'test1', 'test2', 'test1', 'test2', 'test1', 'test2',
      'test1', 'test2', 'test1', 'test2', 'test1', 'test2', 'test1', 'test2', 'test1', 'test2',
      'test1', 'test2', 'test1', 'test2', 'test1', 'test2', 'test1', 'test2', 'test1', 'test2',
      'test1', 'test2', 'test1', 'test2', 'test1', 'test2', 'test1', 'test2', 'test1', 'test2',
      'test1', 'test2', 'test1', 'test2', 'test1', 'test2', 'test1', 'test2', 'test1', 'test2',
      'test1', 'test2', 'test1', 'test2', 'test1', 'test2', 'test1', 'test2', 'test1', 'test2',
    ];

  constructor(private notificationService: NotificationSettingsService) {
  }

  ngOnInit() {
    this.notificationType = NotificationIcon.NONE;
  }

  getNotificationType(): string {
    return this.notificationType;
  }
}

enum NotificationIcon {
  NOTIFICATIONS = 'notifications',
  ACTIVE = 'notifications_active',
  NONE = 'notifications_none',
  OFF = 'notifications_off',
  PAUSED = 'notifications_paused',
}
