import * as mongoose from 'mongoose';
import {Unit} from './Unit';
import {IFreeTextUnit} from '../../../../shared/models/units/IFreeTextUnit';
import {InternalServerError} from 'routing-controllers';
import {ILectureModel, Lecture} from '../Lecture';

interface IFreeTextUnitModel extends IFreeTextUnit, mongoose.Document {
  export: () => Promise<IFreeTextUnit>;
  import: (unit: IFreeTextUnit, courseId: string, lectureId: string) => Promise<IFreeTextUnit>;
}

const freeTextUnitSchema = new mongoose.Schema({
  markdown: {
    type: String,
  }
});


freeTextUnitSchema.statics.import = function(unit: IFreeTextUnit, courseId: string, lectureId: string) {
  unit._course = courseId;

  return new FreeTextUnit(unit).save()
    .then((savedUnit: IFreeTextUnitModel) => {
      return Lecture.findById(lectureId)
        .then((lecture: ILectureModel) => {
          lecture.units.push(savedUnit);
          return lecture.save()
            .then(updatedLecture => {
              return savedUnit;
            });
        });
    })
    .catch((err: Error) => {
      const newError = new InternalServerError('Failed to import freetextunit');
      newError.stack += '\nCaused by: ' + err.stack;
      throw newError;
    });
};

const FreeTextUnit = Unit.discriminator('free-text', freeTextUnitSchema);

export {FreeTextUnit, IFreeTextUnitModel}
