import * as mongoose from 'mongoose';
import {Unit} from './Unit';
import {ITaskUnit} from '../../../../shared/models/units/ITaskUnit';
import {ITaskModel, Task} from '../Task';
import {ITask} from '../../../../shared/models/task/ITask';
import {InternalServerError} from 'routing-controllers';
import {ILectureModel, Lecture} from '../Lecture';

interface ITaskUnitModel extends ITaskUnit, mongoose.Document {
  exportJSON: () => Promise<ITaskUnit>;
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

taskUnitSchema.methods.exportJSON = function() {
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
      return task.exportJSON();
    });
  }))
  .then((exportedTasks) => {
    obj.tasks = exportedTasks;
    return obj;
  });
}

taskUnitSchema.statics.importJSON = async function(taskUnit: ITaskUnit, courseId: string, lectureId: string) {
  taskUnit._course = courseId;

  const tasks: Array<ITask>  = taskUnit.tasks;
  taskUnit.tasks = [];

  try {
  const savedTaskUnit = await new TaskUnit(taskUnit).save();
  taskUnit.tasks = await Promise.all(tasks.map((task: ITask) => {
    return Task.importJSON(task, savedTaskUnit._id);
  }));

  const lecture = await Lecture.findById(lectureId);
  lecture.units.push(<ITaskUnitModel>savedTaskUnit);
  await lecture.save();

  return savedTaskUnit.toObject();
  } catch (err) {
    const newError = new InternalServerError('Failed to import tasks');
    newError.stack += '\nCaused by: ' + err.message + '\n' + err.stack;
    throw newError;
  }
}

const TaskUnit = Unit.discriminator('task', taskUnitSchema);

export {TaskUnit, ITaskUnitModel};
