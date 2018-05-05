import * as mongoose from 'mongoose';
import {IUnitModel} from './Unit';
import {IFileUnit} from '../../../../shared/models/units/IFileUnit';
import {User} from "../User";

interface IFileUnitModel extends IFileUnit, IUnitModel {
  populateUnit: () => Promise<IFileUnitModel>;
  toFile: () => String;
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
}, {
  toObject: {
    transform: function (doc: any, ret: any) {
      ret._id = ret._id.toString();
      ret._course = ret._course.toString();
    }
  },
});

fileUnitSchema.methods.populateUnit = async function() {
  if (this.unitCreator) {
    this.unitCreator = await User.findById(this.unitCreator);
  }
  return this.populate('files').execPopulate();
};

fileUnitSchema.methods.toFile = function() {
  return '';
};

export {fileUnitSchema, IFileUnitModel};
