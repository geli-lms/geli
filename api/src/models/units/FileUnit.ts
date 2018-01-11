import * as mongoose from 'mongoose';
import {Unit} from './Unit';
import {IFileUnit} from '../../../../shared/models/units/IFileUnit';
import fs = require('fs');
import {InternalServerError} from 'routing-controllers';
import {Lecture} from '../Lecture';
import {IFile} from '../../../../shared/models/IFile';

interface IFileUnitModel extends IFileUnit, mongoose.Document {
  exportJSON: () => Promise<IFileUnit>;
}

const fileUnitSchema = new mongoose.Schema({
  files: [
    {
      path: {
        type: String,
      },
      name: {
        type: String,
      },
      alias: {
        type: String,
      },
      size: {
        type: Number
      }
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
      ret.files = ret.files.map((file: any) => {
        file._id = file._id.toString();
        return file;
      });
      ret._course = ret._course.toString();
    }
  },
});

// Cascade delete
fileUnitSchema.pre('remove', function(next: () => void) {
  (<IFileUnitModel>this).files.forEach((file: any) => {
    fs.unlink(file.path, () => {}); // silently discard file not found errors
  });
  next();
});

fileUnitSchema.path('files').set(function (newFiles: IFile[]) {
  this.files.forEach((file: any) => {
    // if not present in new: delete
    if (!newFiles.some((newFile) => newFile.name === file.name)) {
      fs.unlink(file.path, () => {}); // silently discard file not found errors
    }
  });

  return newFiles;
});

// const FileUnit = Unit.discriminator('file', fileUnitSchema);

export {fileUnitSchema, IFileUnitModel}
