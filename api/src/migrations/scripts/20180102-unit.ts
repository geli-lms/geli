// tslint:disable:no-console
import * as mongoose from 'mongoose';
import {IUnit} from '../../../../shared/models/units/IUnit';
import {IUnitModel} from '../../models/units/Unit';

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

const Unit = mongoose.model<IUnitModel>('NewUnit', unitSchema);

class UnitMigration {

  async up() {
    console.log('Unit up was called');
    try {
      const oldUnits: IUnitModel[] = await Unit.find({'__t': {$exists: false}});
      const updatedUnitObjs: IUnit[] = await Promise.all(oldUnits.map(async (oldUnit: IUnitModel) => {
        const oldUnitObj: IUnit = <IUnit>oldUnit.toObject();
        oldUnitObj.__t = oldUnitObj.type;

        return oldUnitObj;
      }));

      const updatedUnits = await Promise.all(oldUnits.map(async (oldUnit) => {
        const updatedUnitObj = updatedUnitObjs.find((updatedUnit: IUnit) => {
          return updatedUnit._id === oldUnit._id.toString();
        });

        updatedUnitObj._id = mongoose.Types.ObjectId(updatedUnitObj._id);

        const unitAfterReplace = await mongoose.connection.collection('units')
          .findOneAndReplace({'_id': oldUnit._id}, updatedUnitObj);
      }));
    } catch (error) {
      console.log('1: ' + error);
    }

    console.log('Unit documents successfully migrated!');
    return true;
  }

  down() {
    console.log('Unit down was called');
  }
}

export = UnitMigration;
