import * as mongoose from 'mongoose';
import {IFile} from '../../../../shared/models/mediaManager/IFile';
import * as fs from 'fs';

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

  // TODO: look for references
  next();
});

const File = mongoose.model<IFileModel>('File', fileSchema);

export {File, IFileModel};
