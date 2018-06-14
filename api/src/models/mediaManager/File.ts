import * as mongoose from 'mongoose';
import {IFile} from '../../../../shared/models/mediaManager/IFile';
import * as fs from 'fs';
import {FileUnit} from '../units/Unit';
import {IFileUnitModel} from '../units/FileUnit';
import {IPictureModel, pictureSchema} from './Picture';

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
      if (ret._id) {
        ret._id = ret._id.toString();
      }
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

    if ((<any>this).__t === 'Picture') {
      const localPicture = <IPictureModel><any>this;
      if (localPicture.breakpoints) {
        for (const breakpoint of localPicture.breakpoints) {
          if (breakpoint.pathToImage && breakpoint.pathToImage !== '-'
            && fs.existsSync(breakpoint.pathToImage)) {

            await promisify(fs.unlink)(breakpoint.pathToImage);
          }

          if (breakpoint.pathToRetinaImage && breakpoint.pathToRetinaImage !== '-'
            && fs.existsSync(breakpoint.pathToRetinaImage)) {

            await promisify(fs.unlink)(breakpoint.pathToRetinaImage);
          }
        }
      }
    }

    const units2Check: IFileUnitModel[] = <IFileUnitModel[]> await FileUnit.find({files: {$in: [localFile._id]}});
    Promise.all(units2Check.map(async unit => {
      const index = unit.files.indexOf(localFile._id);
      if (index > -1) {
        unit.files.splice(index, 1);
        await unit.save();
      }
    }));
  } catch (err) {
    throw new Error('Delete Error: ' + err.toString());
  }
});

const File = mongoose.model<IFileModel>('File', fileSchema);
const Picture = File.discriminator('Picture', pictureSchema);

export {File, Picture, IFileModel};
