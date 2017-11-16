import * as mongoose from 'mongoose';
import {IUnitModel, Unit} from './Unit';
import {IFileUnit} from '../../../../shared/models/units/IFileUnit';
import fs = require('fs');

interface IFileUnitModel extends IFileUnit, mongoose.Document {
  export: () => Promise<IFileUnit>;
  import: (IFileUnit) => (void);
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
    }
  ],
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

fileUnitSchema.methods.export = function() {
  const obj = this.toObject();

  // remove unwanted informations
  // mongo properties
  delete obj._id;
  delete obj.createdAt;
  delete obj.__v;
  delete obj.updatedAt;

  // custom properties
  delete obj._course;

  return obj;
}

// Cascade delete
fileUnitSchema.pre('remove', function(next: () => void) {
  (<IFileUnitModel>this).files.forEach((file: any) => {
    fs.unlink(file.path, () => {}); // silently discard file not found errors
  });
  next();
});

const FileUnit = Unit.discriminator('file', fileUnitSchema);

export {FileUnit, IFileUnitModel}
