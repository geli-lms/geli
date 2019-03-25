import {IDirectory} from '../../../../shared/models/mediaManager/IDirectory';
import {File} from './File';
import * as mongoose from 'mongoose';
import {extractSingleMongoId} from '../../utilities/ExtractMongoId';

interface IDirectoryModel extends IDirectory, mongoose.Document {

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
}, {
  timestamps: true,
  toObject: {
    transform: function (doc: IDirectoryModel, ret: any) {
      ret._id = extractSingleMongoId(ret);
      if (doc.populated('subDirectories') === undefined) {
        ret.subDirectories = ret.subDirectories.map(extractSingleMongoId);
      }
      if (doc.populated('files') === undefined) {
        ret.files = ret.files.map(extractSingleMongoId);
      }
      delete ret._course;
    }
  },
});

directorySchema.pre('remove', async function () {
  const localDir = <IDirectoryModel><any>this;
  try {
    for (const subdir of localDir.subDirectories) {
      // linting won't let us use 'Directory' before it is actually declared
      // tslint:disable-next-line:no-use-before-declare
      const model = await Directory.findById(subdir);
      if (model) {
        await model.remove();
      }
    }
    for (const file of localDir.files) {
      const model = await File.findById(file);
      if (model) {
        await model.remove();
      }
    }
  } catch (err) {
    throw new Error('Delete Error: ' + err.toString());
  }
});

const Directory = mongoose.model<IDirectoryModel>('Directory', directorySchema);

export {Directory, IDirectoryModel};
