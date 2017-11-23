import * as mongoose from 'mongoose';
import {Unit} from './Unit';
import {ICodeKataUnit} from '../../../../shared/models/units/ICodeKataUnit';
import {InternalServerError} from 'routing-controllers';
import {ILectureModel, Lecture} from '../Lecture';

interface ICodeKataModel extends ICodeKataUnit, mongoose.Document {
  exportJSON: () => Promise<ICodeKataUnit>;
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

codeKataSchema.statics.importJSON = async function(unit: ICodeKataUnit, courseId: string, lectureId: string) {
  unit._course = courseId;

  try {
    const savedKata = await new CodeKataUnit(unit).save();
    const lecture = await Lecture.findById(lectureId);
    lecture.units.push(<ICodeKataModel>savedKata);
    await lecture.save();

    return savedKata;
  } catch (err) {
    const newError = new InternalServerError('Failed to import code-kata');
    newError.stack += '\nCaused by: ' + err.message + '\n' + err.stack;
    throw newError;
  }
};

const CodeKataUnit = Unit.discriminator('code-kata', codeKataSchema);

export {CodeKataUnit, ICodeKataModel}
