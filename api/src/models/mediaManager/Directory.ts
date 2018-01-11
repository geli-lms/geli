import {IDirectory} from '../../../../shared/models/mediaManager/IDirectory';
import * as mongoose from 'mongoose';

interface IDIrectoryModel extends IDirectory, mongoose.Document {

}

const directorySchema = new mongoose.Schema({
  _course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  name: {
    type: String,
    required: true
  },
  subDirectories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Directory'
    }
  ],
  files: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File'
    }
  ]
},{
    timestamps: true,
});

const Directory = mongoose.model<IDIrectoryModel>('Directory', directorySchema);

export {Directory, IDIrectoryModel};
