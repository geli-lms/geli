import {ICourse} from './ICourse';
import {IUser} from './IUser';

export const NOTIFICATION_TYPE_NONE = 'none';
export const NOTIFICATION_TYPE_CHANGES_WITH_RELATIONIONSHIP = 'relatedChanges';
export const NOTIFICATION_TYPE_ALL_CHANGES = 'allChanges';
export const NOTIFICATION_TYPES = [
  NOTIFICATION_TYPE_NONE,
  NOTIFICATION_TYPE_CHANGES_WITH_RELATIONIONSHIP,
  NOTIFICATION_TYPE_ALL_CHANGES
];

export interface INotificationSettings {
  _id: any;
  course: ICourse;
  user: IUser;
  notificationType: string;
  emailNotification: boolean;
}

