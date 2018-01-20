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
import emailService from '../services/EmailService';
import {SendMailOptions} from 'nodemailer';
import config from '../config/main';
import {User} from './User';

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

const Notification = mongoose.model<INotificationModel>('Notification', notificationSchema);

notificationSchema.statics.createNotification = async function (
  user: IUser, changedCourse: ICourse, text: string, changedLecture?: ILecture, changedUnit?: IUnit) {
  try {
    let settings = await NotificationSettings.findOne({'user': user, 'course': changedCourse});
    if (settings === undefined || settings === null) {
      settings = await new NotificationSettings(
        {'user': user, 'course': changedCourse, 'notificationType': API_NOTIFICATION_TYPE_ALL_CHANGES, 'emailNotification': false}).save();
    }
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
      if (settings.emailNotification) {
        sendNotificationMail(user, 'you received new notifications for the course ' + changedCourse.name + '.');
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

async function sendNotificationMail(user: IUser, text: string) {
  const message: SendMailOptions = {};
  user = await User.findById(user);
  message.to = user.profile.firstName + ' ' + user.profile.lastName + '<' + user.email + '>';
  message.subject = 'Geli informs: you have new notifications :)';
  message.text = 'Hello ' + user.profile.firstName + ', \n\n' +
     + text + '\n' + 'Please check your notifications in geli.\n' +
    'Your GELI Team.';
  message.html = '<p>Hello ' + user.profile.firstName  + ',</p><br>' +
    '<p>' + text + '<br>Please check your notifications in geli.</p><br>' +
    '<p>Your GELI Team.</p>';
  await emailService.sendFreeFormMail(message);
}



export {Notification, INotificationModel};
