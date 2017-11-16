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

codeKataSchema.methods.export = function() {
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

const CodeKataUnit = Unit.discriminator('code-kata', codeKataSchema);

export {CodeKataUnit, ICodeKataModel}
