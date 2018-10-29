import {INotificationSettings} from '../../../../../shared/models/INotificationSettings';
import {IUser} from '../../../../../shared/models/IUser';
import {ICourseDashboard} from '../../../../../shared/models/ICourseDashboard';

export class NotificationSettings implements INotificationSettings {

  _id: any;
  course: ICourseDashboard;
  user: IUser;
  notificationType: string;
  emailNotification: boolean;

  constructor(user: IUser, course: ICourseDashboard) {
    this.course = course;
    this.user = user;
  }
}
