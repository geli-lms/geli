import * as mongoose from 'mongoose';
import {Unit} from './Unit';
import {IFreeTextUnit} from '../../../../shared/models/units/IFreeTextUnit';

interface IFreeTextUnitModel extends IFreeTextUnit, mongoose.Document {
  export: () => Promise<IFreeTextUnit>;
  import: (IFreeTextUnit) => (void);
}

const freeTextUnitSchema = new mongoose.Schema({
  markdown: {
    type: String,
  }
});

freeTextUnitSchema.methods.export = function() {
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

const FreeTextUnit = Unit.discriminator('free-text', freeTextUnitSchema);

export {FreeTextUnit, IFreeTextUnitModel}
