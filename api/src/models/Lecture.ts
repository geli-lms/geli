import * as mongoose from 'mongoose';
import {ILecture} from '../../../shared/models/ILecture';
import {IUnitModel, Unit} from './units/Unit';
import {IUnit} from '../../../shared/models/units/IUnit';
import {IUser} from '../../../shared/models/IUser';
import {InternalServerError} from 'routing-controllers';
import {Course} from './Course';

interface ILectureModel extends ILecture, mongoose.Document {
  exportJSON: () => Promise<ILecture>;
  processUnitsFor: (user: IUser) => Promise<this>;
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
lectureSchema.pre('remove', async function () {
  const localLecture = <ILectureModel><any>this;
  try {
    await Unit.deleteMany({'_id': {$in: localLecture.units}}).exec();
  } catch (err) {
    throw new Error('Delete Error: ' + err.toString());
  }

});

lectureSchema.methods.exportJSON = async function () {
  const obj = this.toObject();

  // remove unwanted informations
  // mongo properties
  delete obj._id;
  delete obj.createdAt;
  delete obj.__v;
  delete obj.updatedAt;

  // "populate" lectures
  const units: Array<mongoose.Types.ObjectId> = obj.units;
  obj.units = [];

  for (const unitId of units) {
    const unit: IUnitModel = await Unit.findById(unitId);
    if (unit) {
      const unitExport = await unit.exportJSON();
      obj.units.push(unitExport);
    }
  }

  return obj;
};

lectureSchema.methods.processUnitsFor = async function (user: IUser) {
  this.units = await Promise.all(this.units.map(async (unit: IUnitModel) => {
    unit = await unit.populateUnit();
    return unit.secureData(user);
  }));
  return this;
};

lectureSchema.statics.importJSON = async function (lecture: ILecture, courseId: string) {
  // importTest lectures
  const units: Array<IUnit> = lecture.units;
  lecture.units = [];

  try {
    // Need to disabled this rule because we can't export 'Lecture' BEFORE this function-declaration
    // tslint:disable:no-use-before-declare
    const savedLecture = await new Lecture(lecture).save();

    const course = await Course.findById(courseId);
    course.lectures.push(savedLecture);
    await course.save();

    for (const unit of units) {
      await Unit.schema.statics.importJSON(unit, courseId, savedLecture._id);
    }
    const newLecture: ILectureModel = await Lecture.findById(savedLecture._id);

    return newLecture.toObject();
    // tslint:enable:no-use-before-declare
  } catch (err) {
    const newError = new InternalServerError('Failed to import lecture');
    newError.stack += '\nCaused by: ' + err.message + '\n' + err.stack;
    throw newError;
  }
};


const Lecture = mongoose.model<ILectureModel>('Lecture', lectureSchema);

export {Lecture, ILectureModel};
