import * as mongoose from 'mongoose';
import {IUnitModel, Unit} from './Unit';
import {IFileUnit} from '../../../../shared/models/units/IFileUnit';
import fs = require('fs');
import {InternalServerError} from 'routing-controllers';
import {ILectureModel, Lecture} from '../Lecture';

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

// TODO: Implement pre('findOneAndUpdate') and / or pre('update') for file cleanups
fileUnitSchema.pre('findOneAndUpdate', function (next) {
  next();
});

fileUnitSchema.statics.importJSON = async function(unit: IFileUnit, courseId: string, lectureId: string) {
  unit._course = courseId;

  try {
    const savedFile = await new FileUnit(unit).save();
    const lecture = await Lecture.findById(lectureId);
    lecture.units.push(<IFileUnitModel>savedFile);
    await lecture.save();

    return savedFile.toObject();
  } catch (err) {
    const newError = new InternalServerError('Failed to import file');
    newError.stack += '\nCaused by: ' + err.message + '\n' + err.stack;
    throw newError;
  }
};


const FileUnit = Unit.discriminator('file', fileUnitSchema);

export {FileUnit, IFileUnitModel}
