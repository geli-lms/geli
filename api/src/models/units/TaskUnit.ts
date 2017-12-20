import * as mongoose from 'mongoose';
import {Unit} from './Unit';
import {ITaskUnit} from '../../../../shared/models/units/ITaskUnit';
import {ITaskModel, Task} from '../Task';
import {NativeError} from 'mongoose';

interface ITaskUnitModel extends ITaskUnit, mongoose.Document {
  exportJSON: () => Promise<ITaskUnit>;
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
        if (ret.hasOwnProperty('_id')) {
          ret._id =  ret._id.toString();
        }

        if (ret.hasOwnProperty('id')) {
          ret.id = ret.id.toString();
        }
        ret.answers = ret.answers.map((answer: any) => {
          answer._id = answer._id.toString();
          return answer;
        });
      }
    }
  }
);

const taskUnitSchema = new mongoose.Schema({
  tasks: [taskSchema],
  deadline: {
    type: String
  },
});

function cascadeDelete(next: (err?: NativeError) => void) {
  Task.find({'_id': {$in: this.tasks}}).exec()
    .then((tasks) => Promise.all(tasks.map(task => task.remove())))
    .then(() => next())
    .catch(next);
}

taskUnitSchema.pre('remove', cascadeDelete);


taskUnitSchema.methods.exportJSON = async function() {
  const obj = this.toObject();

  // remove unwanted informations
  // mongo properties
  delete obj._id;
  delete obj.createdAt;
  delete obj.__v;
  delete obj.updatedAt;

  // custom properties
  delete obj._course;

  // "populate" tasks
  const tasks: Array<mongoose.Types.ObjectId>  = obj.tasks;
  obj.tasks = [];

  for (const taskId of tasks) {
    const task: ITaskModel = await Task.findById(taskId);
    const taskExport = await task.exportJSON();
    obj.tasks.push(taskExport);
  }

  return obj;
};

const TaskUnit = Unit.discriminator('task', taskUnitSchema);

export {TaskUnit, ITaskUnitModel};
