import * as mongoose from 'mongoose';
import {IWUser} from '../../../shared/models/IWUser';

interface IWUserModel extends IWUser, mongoose.Document {
}

const wUserSchema = new mongoose.Schema({
  firstName: {
      type: String,
      required: true
    },

    lastName: {
      type: String,
      required: true
    },

    uid: {
      type: String,
      required: true
    }
  }
);

const WUser = mongoose.model<IWUserModel>('WUser', wUserSchema);

export {WUser, IWUserModel};
