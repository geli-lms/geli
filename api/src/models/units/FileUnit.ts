import * as mongoose from 'mongoose';
import {IUnitModel} from './Unit';
import {IFileUnit} from '../../../../shared/models/units/IFileUnit';

interface IFileUnitModel extends IFileUnit, IUnitModel {
  exportJSON: () => Promise<IFileUnit>;
  toFile: () => Promise<String>;
}

const fileUnitSchema = new mongoose.Schema({
  files: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File'
    }
  ],
  fileUnitType: {
    type: String,
    required: true
  }
});

export {fileUnitSchema, IFileUnitModel}
