import * as mongoose from 'mongoose';
import {Unit} from './Unit';
import {ITaskUnit} from '../../../../shared/models/units/ITaskUnit';
import {Task} from '../Task';
import {NativeError} from 'mongoose';

interface ITaskUnitModel extends ITaskUnit, mongoose.Document {
}

const taskUnitSchema = new mongoose.Schema({
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    }
  ],
  deadline: {
    type: String
  },
});

taskUnitSchema.path('tasks').validate((value: any) => {
  const debug = 0;
  return true;
});

function cascadeDelete(next: (err?: NativeError) => void) {
  Task.find({'_id': {$in: this.tasks}}).exec()
    .then((tasks) => Promise.all(tasks.map(task => task.remove())))
    .then(() => next())
    .catch(next);
}

taskUnitSchema.pre('remove', cascadeDelete);


const TaskUnit = Unit.discriminator('task', taskUnitSchema);

export {TaskUnit, ITaskUnitModel};
