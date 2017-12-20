import * as mongoose from 'mongoose';
import {ILecture} from '../../../shared/models/ILecture';
import {IUnitModel, Unit} from './units/Unit';
import {IUnit} from '../../../shared/models/units/IUnit';
import {InternalServerError} from 'routing-controllers';
import {Course} from './Course';
import * as winston from 'winston';

interface ILectureModel extends ILecture, mongoose.Document {
  exportJSON: () => Promise<ILecture>;
}

const lectureSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    units: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit'
      }
    ]
  },
  {
    timestamps: true,
    toObject: {
      transform: function (doc: any, ret: any) {
        ret._id = ret._id.toString();
      }
    }
  }
);

// Cascade delete
lectureSchema.pre('remove', function(next: () => void) {
  // We cannot do this, because we need actual Unit instances so that their pre remove middleware gets called
  // Unit.remove({'_id': {$in: this.units}}).exec().then(next).catch(next);
  Unit.find({'_id': {$in: this.units}}).exec()
    .then((units) => Promise.all(units.map(unit => unit.remove())))
    .then(next)
    .catch(next);
});

lectureSchema.methods.exportJSON = async function() {
  const obj = this.toObject();

  // remove unwanted informations
  // mongo properties
  delete obj._id;
  delete obj.createdAt;
  delete obj.__v;
  delete obj.updatedAt;

  // "populate" lectures
  const units: Array<mongoose.Types.ObjectId>  = obj.units;
  obj.units = [];

  for (const unitId of units) {
    const unit: IUnitModel = await Unit.findById(unitId);
    if (unit) {
      const unitExport = await unit.exportJSON();
      obj.units.push(unitExport);
    } else {
      winston.log('warn', 'unit(' + unitId + ') was referenced by lecture(' + this._id + ') but does not exist anymore');
    }
  }

  return obj;
};

lectureSchema.statics.importJSON = async function(lecture: ILecture, courseId: string) {
  // importTest lectures
  const units: Array<IUnit>  = lecture.units;
  lecture.units = [];

  try {
    const savedLecture = await new Lecture(lecture).save();

    const course = await Course.findById(courseId);
    course.lectures.push(savedLecture);
    await course.save();

    for (const unit of units) {
      await Unit.schema.statics.importJSON(unit, courseId, savedLecture._id);
    }
    const newLecture: ILectureModel = await Lecture.findById(savedLecture._id);

    return newLecture.toObject();
  } catch (err) {
    const newError = new InternalServerError('Failed to import lecture');
    newError.stack += '\nCaused by: ' + err.message + '\n' + err.stack;
    throw newError;
  }
};


const Lecture = mongoose.model<ILectureModel>('Lecture', lectureSchema);

export {Lecture, ILectureModel};
