// tslint:disable:no-console
import * as mongoose from 'mongoose';
import {IUnitModel} from '../../src/models/units/Unit';
import {ITaskUnitModel} from '../../src/models/units/TaskUnit';
import {ITaskUnit} from '../../../shared/models/units/ITaskUnit';

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

const TaskUnit = Unit.discriminator('task', taskUnitSchema);

class TaskUnitMigration {

  async up() {
    console.log('TaskUnit up was called');
    try {
      const taskUnits: any[] = await TaskUnit.find({'type': 'task'}).populate('tasks').exec();
      const oldUnits: IUnitModel[] = await Unit.find({'type': 'task'}).populate('tasks').exec();
      const oldUnitObjs: ITaskUnit[] = await oldUnits.map((oldUnit) => {
        return (<ITaskUnit>oldUnit.toObject());
      });

      const updatedTaskUnits = taskUnits.map((taskUnit: ITaskUnitModel) => {
        const matchedUnit = oldUnitObjs.find((oldUnit) => {
          return oldUnit._id.toString() === taskUnit._id.toString();
        });

        taskUnit.tasks = (<ITaskUnitModel>matchedUnit).tasks;

        return taskUnit;
      });

      updatedTaskUnits.forEach((updatedUnit) => {
        updatedUnit.save();
      });

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
