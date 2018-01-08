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
},
  {
    discriminatorKey: 'type',
    timestamps: true,
    toObject: {
      transform: function (doc: any, ret: any) {
        ret._id = ret._id.toString();
        ret.course = ret.course.toString();

        if (doc.populated('user') === undefined) {
          ret.user = ret.user.toString();
        }
      }
    }
  }
);

const NotificationSettings = mongoose.model<INotificationSettingsModel>('NotificationSettings', notificationSettingsSchema);

export {NotificationSettings, INotificationSettingsModel};
