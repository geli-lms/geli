import * as mongoose from 'mongoose';
import {IUnit} from '../../../../shared/models/units/IUnit';
import {NativeError} from 'mongoose';
import {BadRequestError} from 'routing-controllers';

interface IUnitModel extends IUnit, mongoose.Document {
}

const unitSchema = new mongoose.Schema({
    _course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    title: {
      type: String
    },
    progressable: {
      type: Boolean
    },
    weight: {
      type: Number
    },
    name: {
      type: String
    },
    description: {
      type: String
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

unitSchema.virtual('progress', [{
  ref: 'Progress',
  localField: '_id',
  foreignField: 'unit'
}]);

function populateUnit(next: (err?: NativeError) => void) {
  next();
}

unitSchema.pre('find', populateUnit);

const Unit = mongoose.model<IUnitModel>('Unit', unitSchema);

export {Unit, IUnitModel};
