import * as mongoose from 'mongoose';
import {IProgress} from '../../../shared/models/IProgress';

interface IProgressModel extends IProgress, mongoose.Document {
}

const progressSchema = new mongoose.Schema({
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
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
        ret.course = ret.course.toString();

        if (doc.populated('user') === undefined) {
          ret.user = ret.user.toString();
        }

        ret.unit = ret.unit.toString();
      }
    }
  }
);


const Progress = mongoose.model<IProgressModel>('Progress', progressSchema);

export {Progress, IProgressModel};
