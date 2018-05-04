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

fileSchema.pre('remove', async function() {
  const localFile = <IFileModel><any>this;
  try {
    if (fs.existsSync(localFile.physicalPath)) {
      await promisify(fs.unlink)(localFile.physicalPath);
    }

    const units2Check: IFileUnitModel[] = <IFileUnitModel[]>await FileUnit.find({files: {$in: [localFile._id]}});
    Promise.all(units2Check.map(async unit => {
      const index = unit.files.indexOf(localFile._id);
      if (index > -1) {
        unit.files.splice(index, 1);
        await unit.save();
      }
    }));
  } catch(err) {
    throw new Error('Delete Error: ' + err.toString());
  }

});

const File = mongoose.model<IFileModel>('File', fileSchema);

export {File, IFileModel};
