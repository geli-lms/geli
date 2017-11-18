import * as mongoose from 'mongoose';
import {Unit} from './Unit';
import {IFreeTextUnit} from '../../../../shared/models/units/IFreeTextUnit';

interface IFreeTextUnitModel extends IFreeTextUnit, mongoose.Document {
  export: () => Promise<IFreeTextUnit>;
  import: (courseId: string) => Promise<IFreeTextUnit>;
}

const freeTextUnitSchema = new mongoose.Schema({
  markdown: {
    type: String,
  }
});

const FreeTextUnit = Unit.discriminator('free-text', freeTextUnitSchema);

export {FreeTextUnit, IFreeTextUnitModel}
