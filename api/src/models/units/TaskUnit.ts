import * as mongoose from 'mongoose';
import {Unit} from './Unit';
import {ITaskUnit} from '../../../../shared/models/units/ITaskUnit';
import {Task} from '../Task';

interface ITaskUnitModel extends ITaskUnit, mongoose.Document {
  export: () => Promise<ITaskUnit>;
  import: (courseId: string) => Promise<ITaskUnit>;
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

// Cascade delete
taskUnitSchema.pre('remove', function(next: () => void) {
  Task.find({'_id': {$in: this.tasks}}).exec()
    .then((tasks) => Promise.all(tasks.map(task => task.remove())))
    .then(next)
    .catch(next);
});

taskUnitSchema.methods.export = function() {
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

  return Promise.all(tasks.map((taskId) => {
    return Task.findById(taskId).then((task) => {
      return task.export();
    });
  }))
  .then((exportedTasks) => {
    obj.tasks = exportedTasks;
    return obj;
  });
}

taskUnitSchema.methods.import = function(courseId: string) {
  this._course = courseId;
  this.tasks.forEach((task) => {
    task.import();
  });
  return new TaskUnit(this).save();
}

const TaskUnit = Unit.discriminator('task', taskUnitSchema);

export {TaskUnit, ITaskUnitModel};
