import * as mongoose from 'mongoose';
import {Unit} from './Unit';
import {ICodeKataUnit} from '../../../../shared/models/units/ICodeKataUnit';
import {InternalServerError} from 'routing-controllers';
import {ILectureModel, Lecture} from '../Lecture';

interface ICodeKataModel extends ICodeKataUnit, mongoose.Document {
  export: () => Promise<ICodeKataUnit>;
  import: (unit: ICodeKataUnit, courseId: string, lectureId: string) => Promise<ICodeKataUnit>;
}

const codeKataSchema = new mongoose.Schema({
  definition: {
    type: String
  },
  code: {
    type: String
  },
  test: {
    type: String
  },
  deadline: {
    type: String
  },
});

codeKataSchema.statics.import = function(unit: ICodeKataUnit, courseId: string, lectureId: string) {
  unit._course = courseId;

  return new CodeKataUnit(unit).save()
    .then((savedUnit: ICodeKataModel) => {
      return Lecture.findById(lectureId)
        .then((lecture: ILectureModel) => {
          lecture.units.push(savedUnit);
          return lecture.save()
            .then(updatedLecture => {
              return savedUnit;
            });
        });
    })
    .catch((err: Error) => {
      const newError = new InternalServerError('Failed to import course');
      newError.stack += '\nCaused by: ' + err.stack;
      throw newError;
    });
};

const CodeKataUnit = Unit.discriminator('code-kata', codeKataSchema);

export {CodeKataUnit, ICodeKataModel}
