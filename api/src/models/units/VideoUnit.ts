import * as mongoose from 'mongoose';
import {Unit} from './Unit';
import {IVideoUnit} from '../../../../shared/models/units/IVideoUnit';
import fs = require('fs');
import {InternalServerError} from 'routing-controllers';
import {ILectureModel, Lecture} from '../Lecture';

interface IVideoUnitModel extends IVideoUnit, mongoose.Document {
  exportJSON: () => Promise<IVideoUnit>;
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

// Cascade delete
videoUnitSchema.pre('remove', function(next: () => void) {
  (<IVideoUnitModel>this).files.forEach((file: any) => {
    fs.unlink(file.path, () => {}); // silently discard file not found errors
  });
  next();
});

videoUnitSchema.statics.importJSON = async function(unit: IVideoUnit, courseId: string, lectureId: string) {
  unit._course = courseId;

  try {
    const savedVideo = await new VideoUnit(unit).save();
    const lecture = await Lecture.findById(lectureId);
    lecture.units.push(<IVideoUnitModel>savedVideo);
    await lecture.save();

    return savedVideo.toObject();
  } catch (err) {
    const newError = new InternalServerError('Failed to import video');
    newError.stack += '\nCaused by: ' + err.message + '\n' + err.stack;
    throw newError;
  }
};

const VideoUnit = Unit.discriminator('video', videoUnitSchema);

export {VideoUnit, IVideoUnitModel}
