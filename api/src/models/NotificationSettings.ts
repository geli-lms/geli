import * as mongoose from 'mongoose';
import {INotificationSettings} from '../../../shared/models/INotificationSettings';
import {INotificationSettingsView} from '../../../shared/models/INotificationSettingsView';
import {ICourseModel} from './Course';
import {IUser} from '../../../shared/models/IUser';
import {extractSingleMongoId} from '../utilities/ExtractMongoId';

interface INotificationSettingsModel extends INotificationSettings, mongoose.Document {
  exportJson: () => INotificationSettings;
  forView: () => INotificationSettingsView;
}

interface INotificationSettingsMongoose extends mongoose.Model<INotificationSettingsModel> {
  exportPersonalData: (user: IUser) => Promise<INotificationSettings>;
}

let NotificationSettings: INotificationSettingsMongoose;

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
      }
    }
  }
);

notificationSettingsSchema.methods.exportJson = function () {
  const obj = this.toObject();

  // remove unwanted informations
  // mongo properties
  delete obj._id;
  delete obj.createdAt;
  delete obj.__v;
  delete obj.updatedAt;

  // custom properties


  return obj;
};

notificationSettingsSchema.methods.forView = function (this: INotificationSettingsModel): INotificationSettingsView {
  return {
    course: extractSingleMongoId(this.course),
    notificationType: this.notificationType,
    emailNotification: this.emailNotification
  };
};

notificationSettingsSchema.statics.exportPersonalData = async function(user: IUser) {
  const notificationSettings = await NotificationSettings
    .findOne({'user': user._id}, 'course notificationType emailNotification')
    .populate('course', 'name description -_id');

  if (!notificationSettings) {
    return null;
  }

  const notificatinSettingsObj = notificationSettings.exportJson();
  notificatinSettingsObj.course = await <any>(<ICourseModel><any>notificationSettings.course).exportJSON(true, true);

  return notificatinSettingsObj;
};

NotificationSettings = mongoose.model<INotificationSettingsModel,
  INotificationSettingsMongoose>('NotificationSettings', notificationSettingsSchema);

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
