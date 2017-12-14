import * as mongoose from 'mongoose';
import {INotification} from '../../../shared/models/INotification';

interface INotificationModel extends INotification, mongoose.Document {
}

const notificationSchema = new mongoose.Schema({
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
  hasChanges: {
    type: Boolean
  }
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

const Notification = mongoose.model<INotificationModel>('Notification', notificationSchema);

export {Notification, INotificationModel};
