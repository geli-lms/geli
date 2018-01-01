import * as mongoose from 'mongoose';
import {ICodeKataUnitProgress} from '../../../../shared/models/progress/ICodeKataProgress';
import {Progress} from './Progress';

interface ICodeKataProgressModel extends ICodeKataUnitProgress, mongoose.Document {
}

const codeKataProgressSchema = new mongoose.Schema({
    code: {
      type: String
    }
  }
);

// const CodeKataProgress = Progress.discriminator('codeKata', codeKataProgressSchema);

export {codeKataProgressSchema, ICodeKataProgressModel};
