import {IDirectory} from '../../../../shared/models/mediaManager/IDirectory';
import * as mongoose from 'mongoose';
import {ObjectID} from 'bson';

interface IDirectoryModel extends IDirectory, mongoose.Document {

}

const directorySchema = new mongoose.Schema({
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
}, {
    timestamps: true,
    toObject: {
      transform: function (doc: IDirectoryModel, ret: any) {
        ret._id = ret._id.toString();
        ret.subDirectories = ret.subDirectories.map((dir: any) => {
          if (!dir._id) {
            dir = dir.toString();
          }
          return dir;
        });
        ret.files = ret.files.map((file: any) => {
          if (!file._id) {
            file = file.toString();
          }
          return file;
        });
      }
    },
});

const Directory = mongoose.model<IDirectoryModel>('Directory', directorySchema);

export {Directory, IDirectoryModel};
