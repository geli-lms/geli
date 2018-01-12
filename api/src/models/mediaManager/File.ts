import * as mongoose from 'mongoose';
import {IFile} from '../../../../shared/models/mediaManager/IFile';

interface IFileModel extends IFile, mongoose.Document {

}

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  physicalPath: {
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
});

const File = mongoose.model<IFileModel>('File', fileSchema);

export {File, IFileModel};
