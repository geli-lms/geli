import * as mongoose from 'mongoose';
import {IWUser} from '../../../shared/models/IWUser';

interface IWUserModel extends IWUser, mongoose.Document {
}

const wUserSchema = new mongoose.Schema({
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

const WUser = mongoose.model<IWUserModel>('WUser', wUserSchema);

export {WUser, IWUserModel};
