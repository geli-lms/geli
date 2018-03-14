import * as mongoose from 'mongoose';
import {INotification} from '../../../shared/models/INotification';
import {User} from './User';
import {Lecture} from './Lecture';

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

export {Notification, INotificationModel};
