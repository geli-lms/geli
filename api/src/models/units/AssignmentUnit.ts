import * as mongoose from 'mongoose';
import {IUnitModel} from './Unit';
import {IAssignmentUnit} from '../../../../shared/models/units/IAssignmentUnit';
import {NativeError} from 'mongoose';
import {BadRequestError} from 'routing-controllers';
import {IUser} from '../../../../shared/models/IUser';

interface IAssignmentUnit extends IAssignmentUnit, IUnitModel {
  secureData: (user: IUser) => Promise<IAssignmentUnit>;
}

const assignmentSchema = new mongoose.Schema({
  deadline: {
    type: string
  };
assignments: [
  file:  {
  type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
},
user:     {
  type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
},
submitted: {
  type: Boolean
},
checked: {
  type: Interger
}  // 0 = not checked; 1 = Not ok; 2 = ok
];
});

codeKataSchema.methods.secureData = async function (user: IUser): Promise<IAssignmentUnit> {
  if (user.role === 'student') {
    const assignment = this.assignments.filer(user);
    this.assignments = assignment;
  }
  return this;
};

export {codeKataSchema, ICodeKataModel};
