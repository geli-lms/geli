import * as mongoose from 'mongoose';
import {Unit} from './Unit';
import {ICodeKataUnit} from '../../../../shared/models/units/ICodeKataUnit';

interface ICodeKataModel extends ICodeKataUnit, mongoose.Document {
  export: () => Promise<ICodeKataUnit>;
  import: (ICodeKataUnit) => (void);
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

const CodeKataUnit = Unit.discriminator('code-kata', codeKataSchema);

export {CodeKataUnit, ICodeKataModel}
