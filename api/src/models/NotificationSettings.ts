import * as mongoose from 'mongoose';
import {INotificationSettings} from '../../../shared/models/INotificationSettings';

interface INotificationSettingsModel extends INotificationSettings, mongoose.Document {
}

const notificationSettingsSchema = new mongoose.Schema({
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notificationType: {
      type: String
    },
    emailNotification: {
      type: Boolean
    }
  },
  {
    timestamps: true,
    toObject: {
      transform: function (doc: any, ret: any) {
        ret._id = ret._id.toString();
       /* ret.course = ret.course.toString();
        ret.user = ret.user.toString();*/
      }
    }
  }
);

const NotificationSettings = mongoose.model<INotificationSettingsModel>('NotificationSettings', notificationSettingsSchema);

// Ugly copy of shared/models/INotificationSettings.ts
export const API_NOTIFICATION_TYPE_ALL_CHANGES = 'allChanges';
export const API_NOTIFICATION_TYPE_CHANGES_WITH_RELATIONIONSHIP = 'relatedChanges';
export const API_NOTIFICATION_TYPE_NONE = 'none';
export const API_NOTIFICATION_TYPES = [
  API_NOTIFICATION_TYPE_NONE,
  API_NOTIFICATION_TYPE_CHANGES_WITH_RELATIONIONSHIP,
  API_NOTIFICATION_TYPE_ALL_CHANGES
];

export {
  NotificationSettings,
  INotificationSettingsModel,
};
