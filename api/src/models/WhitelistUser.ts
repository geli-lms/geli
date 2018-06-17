import * as mongoose from 'mongoose';
import {IWhitelistUser} from '../../../shared/models/IWhitelistUser';

interface IWhitelistUserModel extends IWhitelistUser, mongoose.Document {
  exportJSON: () => IWhitelistUser;
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

whitelistUserSchema.methods.exportJSON = function () {
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

const WhitelistUser = mongoose.model<IWhitelistUserModel>('WhitelistUser', whitelistUserSchema);

export {WhitelistUser, IWhitelistUserModel};
