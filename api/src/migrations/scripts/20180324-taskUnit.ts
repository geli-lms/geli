// tslint:disable:no-console
import * as mongoose from 'mongoose';
import {ObjectID} from 'bson';
import {IUnitModel} from '../../models/units/Unit';
import {ITaskUnitModel} from '../../models/units/TaskUnit';
import {ITaskUnit} from '../../../../shared/models/units/ITaskUnit';
import {ITask} from '../../../../shared/models/task/ITask';
import {IUnit} from '../../../../shared/models/units/IUnit';

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
    timestamps: true,
    toObject: {
      transform: function (doc: IUnitModel, ret: any) {
        ret._id = doc._id.toString();
        ret._course = ret._course.toString();
      }
    },
  }
);

const Unit = mongoose.model<IUnitModel>('OldUnitForTask', unitSchema);

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
          ret._id = ret._id.toString();
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

const Task = mongoose.model('Task', taskSchema);

class TaskUnitMigration {

  async up() {
    console.log('TaskUnit up was called');
    try {
      const oldUnits: IUnitModel[] = await Unit.find({'__t': 'task'});
      const updatedUnitObjs: IUnit[] = await Promise.all(oldUnits.map(async (oldUnit: ITaskUnitModel) => {
        const oldUnitObj: ITaskUnit = <ITaskUnit>oldUnit.toObject();
        oldUnitObj.tasks = <ITask[]>(await Promise.all(oldUnitObj.tasks.map(async (task) => {
          if (task instanceof ObjectID) {
            const taskData = await Task.findById(task).exec();
            if (taskData === null) {
              return null;
            }
            const taskDataObj = taskData.toObject();
            return taskDataObj;
          } else {
            return task;
          }
        })));

        return oldUnitObj;
      }));

      const updatedUnits = await Promise.all(oldUnits.map(async (oldUnit) => {
        const updatedUnitObj = updatedUnitObjs.find((updatedUnit: IUnit) => {
          return updatedUnit._id === oldUnit._id.toString();
        });

        updatedUnitObj._id = new ObjectID(updatedUnitObj._id);

        const unitAfterReplace = await mongoose.connection.collection('units')
          .findOneAndReplace({'_id': oldUnit._id}, updatedUnitObj);
      }));
    } catch (error) {
      console.log('1: ' + error);
    }

    console.log('TaskUnit documents successfully migrated!');
    return true;
  }

  down() {
    console.log('TaskUnit down was called');
  }
}

export = TaskUnitMigration;
