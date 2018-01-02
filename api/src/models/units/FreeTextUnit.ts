import * as mongoose from 'mongoose';
import {Unit} from './Unit';
import {IFreeTextUnit} from '../../../../shared/models/units/IFreeTextUnit';

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

// const FreeTextUnit = Unit.discriminator('free-text', freeTextUnitSchema);

export {freeTextUnitSchema, IFreeTextUnitModel}
