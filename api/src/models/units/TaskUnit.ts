import * as mongoose from 'mongoose';
import {Unit} from './Unit';

const taskUnitSchema = new mongoose.Schema({
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    }
  ]
});

const TaskUnit = Unit.discriminator('task', taskUnitSchema);

export {TaskUnit}
