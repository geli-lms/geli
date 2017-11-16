import * as mongoose from 'mongoose';
import {IUnit} from '../../../../shared/models/units/IUnit';
import {NativeError} from 'mongoose';
import {Progress} from '../Progress';

interface IUnitModel extends IUnit, mongoose.Document {
  export: () => Promise<IUnit>;
  import: (IUnit) => (void);
}

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

unitSchema.virtual('progress', [{
  ref: 'Progress',
  localField: '_id',
  foreignField: 'unit'
}]);

function populateUnit(next: (err?: NativeError) => void) {
  next();
}

unitSchema.pre('find', populateUnit);

unitSchema.methods.export = function() {
  const obj = this.toObject();

  // remove unwanted informations
  // mongo properties
  delete obj._id;
  delete obj.createdAt;
  delete obj.__v;
  delete obj.updatedAt;

  // custom properties
  delete obj._course;

  return obj;
}



// Cascade delete
unitSchema.pre('remove', function(next: () => void) {
  Progress.remove({'unit': this._id}).exec().then(next).catch(next);
});

const Unit = mongoose.model<IUnitModel>('Unit', unitSchema);

export {Unit, IUnitModel};
