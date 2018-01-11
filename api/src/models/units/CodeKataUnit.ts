import * as mongoose from 'mongoose';
import {Unit} from './Unit';
import {ICodeKataUnit} from '../../../../shared/models/units/ICodeKataUnit';
import {NativeError} from 'mongoose';
import {BadRequestError} from 'routing-controllers';

interface ICodeKataModel extends ICodeKataUnit, mongoose.Document {
  exportJSON: () => Promise<ICodeKataUnit>;
}

const codeKataSchema = new mongoose.Schema({
  definition: {
    type: String,
    required: [true, 'A Kata must contain a definition area']
  },
  code: {
    type: String,
    required: [true, 'A Kata must contain a code area']
  },
  test: {
    type: String,
    required: [true, 'A Kata must contain a test area']
  },
  deadline: {
    type: String
  },
});

function splitCodeAreas(next: (err?: NativeError) => void) {
  const codeKataUnit: ICodeKataModel = this;

  if (codeKataUnit.definition !== undefined || codeKataUnit.test !== undefined || codeKataUnit.code === undefined) {
    return next();
  }

  const separator = '\/\/#+';
  const firstSeparator: number = findFirstIndexOf(codeKataUnit.code, separator);
  const lastSeparator: number = findLastIndexOf(codeKataUnit.code, separator);

  codeKataUnit.definition = codeKataUnit.code.substring(0, firstSeparator).trim();
  codeKataUnit.test = codeKataUnit.code.substring(lastSeparator, codeKataUnit.code.length).trim();
  codeKataUnit.code = codeKataUnit.code.substring(firstSeparator, lastSeparator).trim();

  codeKataUnit.code = codeKataUnit.code.slice(codeKataUnit.code.search('\n')).trim();
  codeKataUnit.test = codeKataUnit.test.slice(codeKataUnit.test.search('\n')).trim();
  next();
}

function findFirstIndexOf(source: string, value: string): number {
  return source.search(value);
}

function findLastIndexOf(source: string, value: string): number {
  const regex = new RegExp(value, '');
  let i = -1;

  // limit execution time (prevent deadlocks)
  let j = 10;
  while (j > 0) {
    j--;
    const result = regex.exec(source.slice(++i));
    if (result != null) {
      i += result.index;
    } else {
      i--;
      break;
    }
  }
  return i;
}

function validateTestArea(testArea: any) {
  if (!testArea.match(new RegExp('function(.|\t)*validate\\(\\)(.|\n|\t)*{(.|\n|\t)*}', 'gmi'))) {
    throw new BadRequestError('The test section must contain a validate function');
  }
  if (!testArea.match(new RegExp('function(.|\t)*validate\\(\\)(.|\n|\t)*{(.|\n|\t)*return(.|\n|\t)*}', 'gmi'))) {
    throw new BadRequestError('The validate function must return something');
  }
  if (!testArea.match(new RegExp('validate\\(\\);', 'gmi'))) {
    throw new BadRequestError('The test section must call the validate function');
  }

  return true;
}

codeKataSchema.pre('validate', splitCodeAreas);
codeKataSchema.path('test').validate(validateTestArea);

// const CodeKataUnit = Unit.discriminator('code-kata', codeKataSchema);

export {codeKataSchema, ICodeKataModel}
