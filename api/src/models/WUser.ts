import * as mongoose from 'mongoose';
import {IWUser} from '../../../shared/models/IWUser';

interface IWUserModel extends IWUser, mongoose.Document {
}

const wUserSchema = new mongoose.Schema({
    fistName: {
      type: String,
      required: true
    },

    lastName: {
      tye: String,
      required: true
    },

    uid: {
      typ: String,
      required: true,
      unique: true
    }
  }
);

const WUser = mongoose.model<IWUserModel>('WUser', wUserSchema);

export {WUser, IWUserModel};
