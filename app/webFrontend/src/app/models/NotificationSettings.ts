import {INotificationSettings} from '../../../../../shared/models/INotificationSettings';
import {ICourse} from '../../../../../shared/models/ICourse';
import {IUser} from '../../../../../shared/models/IUser';

export class NotificationSettings implements INotificationSettings {

  _id: any;
  course: ICourse;
  user: IUser;
  notificationType: string;
  emailNotification: boolean;

  constructor(user: IUser, course: ICourse) {
    this.course = course;
    this.user = user;
  }
}
