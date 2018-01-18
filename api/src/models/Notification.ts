import * as mongoose from 'mongoose';
import {INotification} from '../../../shared/models/INotification';
import {IUser} from '../../../shared/models/IUser';
import {ICourse} from '../../../shared/models/ICourse';
import {ILecture} from '../../../shared/models/ILecture';
import {IUnit} from '../../../shared/models/units/IUnit';
import {
  API_NOTIFICATION_TYPE_ALL_CHANGES, API_NOTIFICATION_TYPE_CHANGES_WITH_RELATIONIONSHIP, API_NOTIFICATION_TYPE_NONE,
  INotificationSettingsModel,
  NotificationSettings
} from './NotificationSettings';
import {InternalServerError} from 'routing-controllers';

interface INotificationModel extends INotification, mongoose.Document {
}

const notificationSchema = new mongoose.Schema({
  user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
  },
  changedCourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  changedLecture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecture'
  },
  changedUnit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit'
  },
  text: {
    required: true,
    type: String
  },
  isOld: {
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

notificationSchema.statics.createNotification = async function (
  user: IUser, changedCourse: ICourse, text: string, changedLecture?: ILecture, changedUnit?: IUnit) {
  try {
    const settings = await NotificationSettings.findOne({'user': user, 'course': changedCourse});
    if (settings.notificationType === API_NOTIFICATION_TYPE_ALL_CHANGES) {
      const notification = new Notification();
      notification.user = user;
      notification.changedCourse = changedCourse;
      notification.text = text;
      if (changedLecture) {
        notification.changedLecture = changedLecture;
      }
      if (changedUnit) {
        notification.changedUnit = changedUnit;
      }
      notification.isOld = false;
      return notification.save();
    }
  } catch (err) {
    const newError = new InternalServerError('Failed to create notification');
    newError.stack += '\nCaused by: ' + err.message + '\n' + err.stack;
    throw newError;
  }
}

const Notification = mongoose.model<INotificationModel>('Notification', notificationSchema);

export {Notification, INotificationModel};
