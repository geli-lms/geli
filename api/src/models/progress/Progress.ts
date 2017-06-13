import * as mongoose from 'mongoose';
import {IProgress} from '../../../../shared/models/progress/IProgress';

interface IProgressModel extends IProgress, mongoose.Document {
}

const progressSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unit'
    },
    done: {
      type: Boolean
    }
  },
  {
    discriminatorKey: 'type',
    timestamps: true,
    toObject: {
      transform: function (doc: any, ret: any) {
        ret._id = ret._id.toString();
      }
    }
  }
);


const Progress = mongoose.model<IProgressModel>('Progress', progressSchema);

export {Progress, IProgressModel};
