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
    }
  }
);

whitelistUserSchema.index({
  firstName: 'text',
  lastName: 'text',
  uid: 'text'
}, {name: 'whitelist_user_combined'});

const WhitelistUser = mongoose.model<IWhitelistUserModel>('WhitelistUser', whitelistUserSchema);

export {WhitelistUser, IWhitelistUserModel};
