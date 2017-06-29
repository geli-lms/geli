import * as mongoose from 'mongoose';
import {IWhitelistUser} from '../../../shared/models/IWhitelistUser';

interface IWhitelistUserModel extends IWhitelistUser, mongoose.Document {
}

const whitelistUserSchema = new mongoose.Schema({
  firstName: {
      type: String,
      lowercase: true,
      required: true,
      trim: true
    },

    lastName: {
      type: String,
      lowercase: true,
      required: true,
      trim: true
    },

    uid: {
      type: String,
      required: true,
      trim: true
    }
  }
);

const WhitelistUser = mongoose.model<IWhitelistUserModel>('WhitelistUser', whitelistUserSchema);

export {WhitelistUser, IWhitelistUserModel};
