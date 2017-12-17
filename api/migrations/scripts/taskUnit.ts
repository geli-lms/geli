// tslint:disable:no-console
import * as mongoose from 'mongoose';
import {IUnitModel} from '../../src/models/units/Unit';

const unitSchema = new mongoose.Schema({
    _course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    progressable: {
      type: Boolean
    },
    weight: {
      type: Number
    }
  },
  {
    collection: 'units',
    discriminatorKey: 'type',
    timestamps: true,
    toObject: {
      transform: function (doc: IUnitModel, ret: any) {
        ret._id = doc._id.toString();
        ret._course = ret._course.toString();
      }
    },
  }
);

const Unit = mongoose.model<IUnitModel>('Unit', unitSchema);

class TaskUnitMigration {

  async up() {
    console.log('TaskUnit up was called');
    try {
      const taskUnits = await Unit.find({'type': 'task'}).exec();
      console.log('Task: ' + taskUnits);
      const debug = 0;
    } catch (error) {
      console.log('1: ' + error);
    }

    console.log('ABC');
    return true;
  }

  down() {
    console.log('TaskUnit down was called');
  }
}

export = TaskUnitMigration;
