export {NOTIFICATION_TYPE_NONE} from './INotificationSettings';
export {NOTIFICATION_TYPE_CHANGES_WITH_RELATIONIONSHIP} from './INotificationSettings';
export {NOTIFICATION_TYPE_ALL_CHANGES} from './INotificationSettings';
export {NOTIFICATION_TYPES} from './INotificationSettings';

/**
 * Defines what the three `NotificationSettingsController` routes return as response (in form of an array).
 * It is the version of `INotificationSettings` interface used in the front-end: The property names are identical, but the `course`
 * only represents the `_id` of the corresponding full interface. The `user` is completely omitted, because the notification
 * settings currently can only be requested by the owner (i.e. `@CurrentUser`) anyway.
 * (Also, the `_id` is of type `string` instead of `any`, since the `any` in `INotificationSettings` is only there for compatibility
 * with `mongoose.Document` to form `INotificationModel`.)
 */
export interface INotificationSettingsView {
  _id: string;
  course: string;
  notificationType: string;
  emailNotification: boolean;
}
