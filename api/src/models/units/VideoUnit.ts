import * as mongoose from 'mongoose';
import {Unit} from './Unit';
import {IVideoUnit} from '../../../../shared/models/units/IVideoUnit';
import fs = require('fs');

interface IVideoUnitModel extends IVideoUnit, mongoose.Document {
  export: () => Promise<IVideoUnit>;
  import: (IVideoUnit) => (void);
}

const videoUnitSchema = new mongoose.Schema({
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

videoUnitSchema.methods.export = function() {
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
videoUnitSchema.pre('remove', function(next: () => void) {
  (<IVideoUnitModel>this).files.forEach((file: any) => {
    fs.unlink(file.path, () => {}); // silently discard file not found errors
  });
  next();
});

const VideoUnit = Unit.discriminator('video', videoUnitSchema);

export {VideoUnit, IVideoUnitModel}
