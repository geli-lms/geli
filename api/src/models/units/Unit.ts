import * as mongoose from 'mongoose';
import {IUnit} from '../../../../shared/models/units/IUnit';
import {NativeError} from 'mongoose';

interface IUnitModel extends IUnit, mongoose.Document {
}

const unitSchema = new mongoose.Schema({
    _course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
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
      transform: function (doc: any, ret: any) {
        ret._id = ret._id.toString();
      }
    },
  }
);

function populateUnit(next: (err?: NativeError) => void) {
  const debug = 0;
  next();
}

unitSchema.pre('find', populateUnit);

const Unit = mongoose.model<IUnitModel>('Unit', unitSchema);

export {Unit, IUnitModel};
