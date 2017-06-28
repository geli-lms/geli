import * as mongoose from 'mongoose';
import {ICodeKataProgress} from '../../../shared/models/ICodeKataProgress';
import {Progress} from './Progress';

interface ICodeKataProgressModel extends ICodeKataProgress, mongoose.Document {
}

const codeKataProgressSchema = new mongoose.Schema({
    code: {
      type: String
    }
  }
);

const CodeKataProgress = Progress.discriminator('codeKata', codeKataProgressSchema);

export {CodeKataProgress, ICodeKataProgressModel};
