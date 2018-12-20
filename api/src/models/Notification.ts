import * as mongoose from 'mongoose';
import {INotification} from '../../../shared/models/INotification';
import {INotificationView} from '../../../shared/models/INotificationView';
import {IUser} from '../../../shared/models/IUser';
import {extractSingleMongoId} from '../utilities/ExtractMongoId';

interface INotificationModel extends INotification, mongoose.Document {
  exportJSON: () => Promise<INotificationModel>;
  forView: () => INotificationView;
}

interface INotificationMongoose extends mongoose.Model<INotificationModel> {
  exportPersonalData: (user: IUser) => Promise<INotification>;
}

let Notification: INotificationMongoose;

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

notificationSchema.methods.exportJSON = function () {
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

notificationSchema.methods.forView = function (this: INotificationModel): INotificationView {
  return {
    _id: extractSingleMongoId(this),
    changedCourse: extractSingleMongoId(this.changedCourse),
    changedLecture: extractSingleMongoId(this.changedLecture),
    changedUnit: extractSingleMongoId(this.changedUnit),
    text: this.text,
    isOld: this.isOld
  };
};

notificationSchema.statics.exportPersonalData = async function(user: IUser) {
  return (await Notification.find({'user': user._id}, 'text'))
    .map(not => not.exportJSON());
};

Notification = mongoose.model<INotificationModel, INotificationMongoose>('Notification', notificationSchema);

export {Notification, INotificationModel};
