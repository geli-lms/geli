import * as mongoose from 'mongoose';
import {Progress} from './Progress';
import {ITaskUnitProgress} from '../../../shared/models/ITaskUnitProgress';
import {ITaskUnitModel, TaskUnit} from './units/TaskUnit';

interface ITaskUnitProgressModel extends ITaskUnitProgress, mongoose.Document {
}

const taskUnitProgressSchema = new mongoose.Schema({
    answers: {
      type: {},
      required: true,
    }
  }
);

taskUnitProgressSchema.pre('save', async function (next: () => void) {
  const task = <ITaskUnitModel> await TaskUnit.findById(this.unit).populate('tasks');

  this.done = true;

  task.tasks.forEach(question => {
    question.answers.forEach(answer => {
      if (
        !this.answers[question._id.toString()] ||
        this.answers[question._id.toString()][answer._id.toString()] !== !!answer.value // !! is necessary, because value can be undefined
      ) {
        this.done = false;
      }
    })
  });

  next();
});

const TaskUnitProgress = Progress.discriminator('task-unit-progress', taskUnitProgressSchema);

export {TaskUnitProgress, ITaskUnitProgressModel};
