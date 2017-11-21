import * as mongoose from 'mongoose';
import {Unit} from './Unit';
import {IFreeTextUnit} from '../../../../shared/models/units/IFreeTextUnit';
import {InternalServerError} from 'routing-controllers';

interface IFreeTextUnitModel extends IFreeTextUnit, mongoose.Document {
  export: () => Promise<IFreeTextUnit>;
  import: (unit: IFreeTextUnit, courseId: string) => Promise<IFreeTextUnit>;
}

const freeTextUnitSchema = new mongoose.Schema({
  markdown: {
    type: String,
  }
});


freeTextUnitSchema.statics.import = function(unit: IFreeTextUnit, courseId: string) {
  unit._course = courseId;

  return new FreeTextUnit(unit).save()
    .catch((err: Error) => {
      const newError = new InternalServerError('Failed to import freetextunit');
      newError.stack += '\nCaused by: ' + err.stack;
      throw newError;
    });
};

const FreeTextUnit = Unit.discriminator('free-text', freeTextUnitSchema);

export {FreeTextUnit, IFreeTextUnitModel}
