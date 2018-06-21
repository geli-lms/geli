import * as mongoose from 'mongoose';
import {Progress} from './Progress';
import {ITaskUnitProgress} from '../../../../shared/models/progress/ITaskUnitProgress';
import {ITaskUnitModel} from '../units/TaskUnit';
import {Unit} from '../units/Unit';
import {IProgress} from '../../../../shared/models/progress/IProgress';

interface ITaskUnitProgressModel extends ITaskUnitProgress, mongoose.Document {
  exportJSON: () => Promise<ITaskUnitProgressModel>;
}

const taskUnitProgressSchema = new mongoose.Schema({
    answers: {
      type: {},
      required: true,
    }
  }
);

taskUnitProgressSchema.pre('save', async function (next: () => void) {
  const localProg = <ITaskUnitProgressModel><any>this;
  const taskUnit = <ITaskUnitModel> await Unit.findById(localProg.unit);

  localProg.done = true;

  taskUnit.tasks.forEach(question => {
    question.answers.forEach(answer => {
      if (
        // !! is necessary, because value can be undefined
        !localProg.answers[question._id.toString()] ||
        localProg.answers[question._id.toString()][answer._id.toString()] !== !!answer.value
      ) {
        localProg.done = false;
      }
    });
  });

  next();
});


taskUnitProgressSchema.methods.exportJSON = async function () {
  const localProg = <ITaskUnitProgressModel><any>this;
  if (localProg.unit) {
    const taskUnit = <ITaskUnitModel> await Unit.findById(localProg.unit);

    taskUnit.tasks.forEach(question => {
      delete question._id;
      this.answers = question;
    });
  }

  const obj = this.toObject();

  // remove unwanted informations
  // mongo properties
  delete obj._id;
  delete obj.createdAt;
  delete obj.__v;
  delete obj.updatedAt;

  // custom properties
  return obj;
};


// const TaskUnitProgress = Progress.discriminator('task-unit-progress', taskUnitProgressSchema);

export {taskUnitProgressSchema, ITaskUnitProgressModel};
