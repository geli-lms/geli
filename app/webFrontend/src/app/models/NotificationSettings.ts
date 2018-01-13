import {INotificationSettings} from '../../../../../shared/models/INotificationSettings';
import {ICourse} from '../../../../../shared/models/ICourse';
import {IUser} from '../../../../../shared/models/IUser';

export class NotificationSettings implements INotificationSettings {
  _id: any;
  course: ICourse;
  user: IUser;
  notificationType: string;

  constructor(id: any, course: ICourse, user: IUser, notificationType: string) {
    this._id = id;
    this.course = course;
    this.user = user;
    this.notificationType = notificationType;
  }
}
