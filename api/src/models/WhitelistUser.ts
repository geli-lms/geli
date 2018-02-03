import * as mongoose from 'mongoose';
import {IWhitelistUser} from '../../../shared/models/IWhitelistUser';

interface IWhitelistUserModel extends IWhitelistUser, mongoose.Document {
}

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

const WhitelistUser = mongoose.model<IWhitelistUserModel>('WhitelistUser', whitelistUserSchema);

export {WhitelistUser, IWhitelistUserModel};
