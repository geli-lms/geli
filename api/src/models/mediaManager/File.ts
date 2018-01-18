import * as mongoose from 'mongoose';
import {IFile} from '../../../../shared/models/mediaManager/IFile';

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

const File = mongoose.model<IFileModel>('File', fileSchema);

export {File, IFileModel};
