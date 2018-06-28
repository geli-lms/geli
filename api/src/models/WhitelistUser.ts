import * as mongoose from 'mongoose';
import {IWhitelistUser} from '../../../shared/models/IWhitelistUser';
import {INotificationSettings} from '../../../shared/models/INotificationSettings';
import {IUser} from '../../../shared/models/IUser';
import {INotificationSettingsModel} from './NotificationSettings';
import {ICourseModel} from './Course';
import {relativeTimeThreshold} from 'moment';

interface IWhitelistUserModel extends IWhitelistUser, mongoose.Document {
  exportJSON: () => IWhitelistUser;
}

interface IWhitelistUserMongoose extends mongoose.Model<IWhitelistUserModel> {
  exportPersonalData: (user: IUser) => Promise<INotificationSettings>;
}

let WhitelistUser: IWhitelistUserMongoose;

const whitelistUserSchema = new mongoose.Schema({
    firstName: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
      index: true
    },

    lastName: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
      index: true
    },

    uid: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
      transform: function (doc: any, ret: any) {
        ret._id = ret._id.toString();
      }
    }
  });
// Prevent duplicates in one course.
whitelistUserSchema.index({ uid: 1, courseId: 1}, { unique: true });

whitelistUserSchema.methods.exportJSON = function () {
  const obj = this.toObject();

  // remove unwanted informations
  // mongo properties
  delete obj._id;
  delete obj.createdAt;
  delete obj.__v;
  delete obj.updatedAt;

  // custom properties
  delete obj.id;
  return obj;
};

whitelistUserSchema.statics.exportPersonalData = async function(user: IUser) {
  return Promise.all((await WhitelistUser.find({uid: user.uid})
    .populate('courseId', 'name description -_id'))
    .map(async whiteListU => {
      const course = await (<ICourseModel><any>whiteListU.courseId).exportJSON(true, true);
      const whiteListObj = whiteListU.exportJSON();
      whiteListObj.courseId = <any>course;
      return whiteListObj;
    }));
};

WhitelistUser = mongoose.model<IWhitelistUserModel, IWhitelistUserMongoose>('WhitelistUser', whitelistUserSchema);

export {WhitelistUser, IWhitelistUserModel};
