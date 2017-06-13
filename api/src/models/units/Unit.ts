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
    title: {
      type: String,
      required: true
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

function unitPopulate(next: (err?: NativeError) => void) {
}

unitSchema.virtual('progress', [{
  ref: 'Progress',
  localField: '_id',
  foreignField: 'unit'
}]);

function populateUnit(next: (err?: NativeError) => void) {
  const debug = 0;
  next();
}

unitSchema.pre('find', populateUnit);

const Unit = mongoose.model<IUnitModel>('Unit', unitSchema);

export {Unit, IUnitModel};
