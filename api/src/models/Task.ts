import * as mongoose from 'mongoose';
import {ITask} from '../../../shared/models/task/ITask';
import {InternalServerError} from 'routing-controllers';

interface ITaskModel extends ITask, mongoose.Document {
  exportJSON: () => Promise<ITask>;
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

taskSchema.methods.exportJSON = function() {
  const obj = this.toObject();

  // remove unwanted informations
  // mongo properties
  delete obj._id;
  delete obj.createdAt;
  delete obj.__v;
  delete obj.updatedAt;

  // custom properties
  obj.answers.forEach((answer: any) => {
    delete answer._id;
  });

  return obj;
};

taskSchema.statics.importJSON = function(task: ITask, unitId: string) {
  return new Task(task).save()
    .catch((err: Error) => {
      const newError = new InternalServerError('Failed to import task');
      newError.stack += '\nCaused by: ' + err.message + '\n' + err.stack;
      throw newError;
    });
}

const Task = mongoose.model<ITaskModel>('Task', taskSchema);

export {Task, ITaskModel};
