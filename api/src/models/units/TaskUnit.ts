import * as mongoose from 'mongoose';
import {Unit} from './Unit';
import {ITaskUnit} from '../../../../shared/models/units/ITaskUnit';
import {NativeError} from 'mongoose';

interface ITaskUnitModel extends ITaskUnit, mongoose.Document {
}

const taskUnitSchema = new mongoose.Schema({
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      autopopulate: true
    }
  ]
});

function prePopulateUnit(next: (err?: NativeError) => void) {
  this.populate('tasks');
  const debug = 0;
  next();
}

function postPopulateUnit(doc: ITaskUnitModel, next: (err?: NativeError) => void) {
  const debug = 0;
  next();
}

Unit.schema.pre('find', prePopulateUnit);
Unit.schema.post('find', postPopulateUnit);

const TaskUnit = Unit.discriminator('task', taskUnitSchema);

export {TaskUnit, ITaskUnitModel}
