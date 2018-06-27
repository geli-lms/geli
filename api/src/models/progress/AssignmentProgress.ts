import * as mongoose from 'mongoose';
import {IAssignmentUnitProgress} from '../../../../shared/models/progress/IAssignmentProgress';
import {Progress} from './Progress';

interface IAssignmentProgressModel extends IAssignmentUnitProgress, mongoose.Document {
}

const assignmentProgressSchema = new mongoose.Schema({
    comment: {
      type: String
    }
  }
);

// const CodeKataProgress = Progress.discriminator('assignment', assignmentProgressSchema);

export {assignmentProgressSchema, IAssignmentProgressModel};
