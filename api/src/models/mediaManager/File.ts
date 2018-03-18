import * as mongoose from 'mongoose';
import {IFile} from '../../../../shared/models/mediaManager/IFile';
import * as fs from 'fs';
import {FileUnit} from '../units/Unit';
import {IFileUnitModel} from '../units/FileUnit';

const {promisify} = require('util');

interface IFileModel extends IFile, mongoose.Document {
  physicalPath: string;
}

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  physicalPath: {
    type: String
  },
  link: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
  },
}, {
  timestamps: true,
  toObject: {
    transform: function (doc: IFileModel, ret: any) {
      ret._id = ret._id.toString();
      delete ret.physicalPath;
      return ret;
    }
  },
});

fileSchema.pre('remove', async function(next: () => void) {
  if (fs.existsSync(this.physicalPath)) {
    await promisify(fs.unlink)(this.physicalPath);
  }

  const units2Check: IFileUnitModel[] = <IFileUnitModel[]>await FileUnit.find({files: { $in: [ this._id ] }});
  Promise.all(units2Check.map(async unit => {
    let index = unit.files.indexOf(this._id);
    if (index > -1) {
      unit.files.splice(index, 1);
      await unit.save();
    }
  }));

  next();
});

const File = mongoose.model<IFileModel>('File', fileSchema);

export {File, IFileModel};
