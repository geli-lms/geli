import * as mongoose from 'mongoose';
import {IAssignmentUnit} from '../../../../shared/models/units/IAssignmentUnit';
import {IUnitModel, Unit} from './Unit';

interface IAssignmentUnitModel extends IAssignmentUnit, IUnitModel {
  // secureData: (user: IUser) => Promise<IAssignmentUnit>;
}

const assignmentsSchema = new mongoose.Schema({
    assignments: [{
      file: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      submitted: {
        type: Boolean
      },
      checked: {
        type: Number
      }
    }],
    deadline: {
      type: String
    }
  }
);


// assignmentSchema.methods.secureData = async function (user: IUser): Promise<IAssignmentUnit> {
//   if (user.role === 'student') {
//     const assignment = this.assignments.filter(user);
//     this.assignments = assignment;
//   }
//   return this;
// };

export {assignmentsSchema, IAssignmentUnitModel};
