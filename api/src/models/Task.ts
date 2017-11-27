import * as mongoose from 'mongoose';
import {ITask} from '../../../shared/models/task/ITask';

interface ITaskModel extends ITask, mongoose.Document {
}

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    unitId: {
      type: String
    }
    ,
    answers: {
      type: [{
        value: Boolean,
        text: String
      }],
      required: true
    },
  }, {
    timestamps: true,
    toObject: {
      transform: function (doc: any, ret: any) {
        ret._id = doc.id;
        // remove id for embedded documents
        for (const answer of ret.answers) {
          delete answer._id;
        }
      }
    }
  }
);

const Task = mongoose.model<ITaskModel>('Task', taskSchema);

export {Task, ITaskModel};
