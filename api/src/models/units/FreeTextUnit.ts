import * as mongoose from 'mongoose';
import {Unit} from './Unit';
import {IFreeTextUnit} from '../../../../shared/models/units/IFreeTextUnit';
import {InternalServerError} from 'routing-controllers';
import {ILectureModel, Lecture} from '../Lecture';

interface IFreeTextUnitModel extends IFreeTextUnit, mongoose.Document {
  exportJSON: () => Promise<IFreeTextUnit>;
  toFile: () => String;
}

const freeTextUnitSchema = new mongoose.Schema({
  markdown: {
    type: String,
  }
});

freeTextUnitSchema.statics.toFile = function (unit: IFreeTextUnit) {
  return unit.name + '\n' + unit.description + '\n' + unit.markdown;
};

freeTextUnitSchema.statics.importJSON = async function(unit: IFreeTextUnit, courseId: string, lectureId: string) {
  unit._course = courseId;
  try {
    const savedFreeText = await new FreeTextUnit(unit).save();
    const lecture = await Lecture.findById(lectureId);
    lecture.units.push(<IFreeTextUnitModel>savedFreeText);
    await lecture.save();

    return savedFreeText.toObject();
  } catch (err) {
    const newError = new InternalServerError('Failed to import free-text');
    newError.stack += '\nCaused by: ' + err.message + '\n' + err.stack;
    throw newError;
  }
};

const FreeTextUnit = Unit.discriminator('free-text', freeTextUnitSchema);

export {FreeTextUnit, IFreeTextUnitModel}
