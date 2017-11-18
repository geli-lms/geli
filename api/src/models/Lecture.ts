import * as mongoose from 'mongoose';
import {ILecture} from '../../../shared/models/ILecture';
import {IUnitModel, Unit} from './units/Unit';
import {IUnit} from '../../../shared/models/units/IUnit';
import {InternalServerError} from 'routing-controllers';

interface ILectureModel extends ILecture, mongoose.Document {
  export: () => Promise<ILecture>;
  import: (lecture: ILecture, courseId: String) => Promise<ILecture>;
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

lectureSchema.methods.export = function() {
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

  return Promise.all(units.map((unitId: mongoose.Types.ObjectId) => {
    return Unit.findById(unitId).then((unit: IUnitModel) => {
      return unit.export();
    });
  }))
    .then((exportedUnits: IUnit[]) => {
      obj.units = exportedUnits;
      return obj;
    });
};

lectureSchema.methods.import = function(lecture: ILecture, courseId: string) {
  // import lectures
  const units: Array<IUnit>  = lecture.units;
  lecture.units = [];

  return new Lecture(lecture).save()
    .then((savedLecture: ILectureModel) => {
      const lectureId = savedLecture._id;

      return Promise.all(units.map((unit: IUnit) => {
        return new Unit().import(unit, courseId);
      }))
        .then((importedUnits: IUnit[]) => {
          savedLecture.units.concat(importedUnits);
          return savedLecture.save();
        });
    })
    .then((importedLecture: ILectureModel) => {
      console.log(importedLecture);
      return importedLecture.toObject();
    })
    .catch((err: any) => {
      throw new InternalServerError(err);
    });
};


const Lecture = mongoose.model<ILectureModel>('Lecture', lectureSchema);

export {Lecture, ILectureModel};
