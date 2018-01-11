import * as mongoose from 'mongoose';
import {IUnit} from '../../../../shared/models/units/IUnit';
import {Progress} from '../progress/Progress';
import {InternalServerError} from 'routing-controllers';

import {Lecture} from '../Lecture';
import {freeTextUnitSchema} from './FreeTextUnit';
import {codeKataSchema} from './CodeKataUnit';
import {fileUnitSchema} from './FileUnit';
import {taskUnitSchema} from './TaskUnit';

interface IUnitModel extends IUnit, mongoose.Document {
  exportJSON: () => Promise<IUnit>;
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
    },
    type: {
      type: String
    }
  },
  {
    collection: 'units',
    timestamps: true,
    toObject: {
      transform: function (doc: IUnitModel, ret: any) {
        ret._id = ret._id.toString();
        ret._course = ret._course.toString();
      }
    },
  }
);

unitSchema.virtual('progressData', {
  ref: 'Progress',
  localField: '_id',
  foreignField: 'unit',
  justOne: true
});

unitSchema.methods.exportJSON = function() {
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
};

unitSchema.statics.importJSON = async function(unit: IUnit, courseId: string, lectureId: string) {
  unit._course = courseId;

  try {
    // tslint:disable:no-use-before-declare
    const savedUnit = await Unit.create(unit);
    const lecture = await Lecture.findById(lectureId);
    lecture.units.push(savedUnit);
    await lecture.save();

    return savedUnit.toObject();
    // tslint:enable:no-use-before-declare
  } catch (err) {
    const newError = new InternalServerError('Failed to import unit of type ' + unit.__t);
    newError.stack += '\nCaused by: ' + err.message + '\n' + err.stack;
    throw newError;
  }
};

// Cascade delete
unitSchema.pre('remove', function(next: () => void) {
  Progress.remove({'unit': this._id}).exec().then(next).catch(next);
});

const Unit = mongoose.model<IUnitModel>('Unit', unitSchema);
const FreeTextUnit = Unit.discriminator('free-text', freeTextUnitSchema);
const CodeKataUnit = Unit.discriminator('code-kata', codeKataSchema);
const FileUnit = Unit.discriminator('file', fileUnitSchema);
const TaskUnit = Unit.discriminator('task', taskUnitSchema);

export {Unit, IUnitModel};
