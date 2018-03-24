import * as mongoose from 'mongoose';
import {IUnitModel} from './Unit';
import {IFreeTextUnit} from '../../../../shared/models/units/IFreeTextUnit';

interface IFreeTextUnitModel extends IFreeTextUnit, IUnitModel {
  exportJSON: () => Promise<IFreeTextUnit>;
  toFile: () => Promise<String>;
}

const freeTextUnitSchema = new mongoose.Schema({
  markdown: {
    type: String,
  }
});

freeTextUnitSchema.statics.toFile = async function (unit: IFreeTextUnit) {
  return unit.name + '\n' + unit.description + '\n' + unit.markdown;
};

export {freeTextUnitSchema, IFreeTextUnitModel}
