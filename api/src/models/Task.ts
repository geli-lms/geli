import * as mongoose from 'mongoose';
import {ITask} from '../../../shared/models/task/ITask';

interface ITaskModel extends ITask, mongoose.Document {
  export: () => Promise<ITask>;
  import: (task: ITask) => Promise<ITask>;
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
      }
    }
  }
);

taskSchema.methods.export = function() {
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

taskSchema.methods.import = function() {
  return this.save();
}

const Task = mongoose.model<ITaskModel>('Task', taskSchema);

export {Task, ITaskModel};
