import * as mongoose from 'mongoose';
import {IAssignmentUnit} from '../../../../shared/models/units/IAssignmentUnit';
import {IUser} from '../../../../shared/models/IUser';
import {IUnitModel, Unit} from './Unit';
import {File} from '../mediaManager/File';
import {User} from '../User';

interface IAssignmentUnitModel extends IAssignmentUnit, IUnitModel {
  // secureData: (user: IUser) => Promise<IAssignmentUnit>;
}

const assignmentsSchema = new mongoose.Schema({
    assignments: [{
      files: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
      }],
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      submitted: {
        type: Boolean
      },
      checked: {
        type: Number
      },
      submittedDate: {
        type: Date
      }
    }],
    deadline: {
      type: String
    }
  }
);

assignmentsSchema.pre('save', function () {
  const localUnit = <IAssignmentUnitModel><any>this;
  if (localUnit.assignments === null) {
    localUnit.assignments = [];
  }
});


assignmentsSchema.methods.secureData = async function (user: IUser): Promise<IAssignmentUnit> {
  if (this.assignments.length) {
    if (user.role === 'student') {

      let assignmentToUse;

      for (const assignment of this.assignments) {
        if (assignment.user._id.toString() === user._id) {
          assignmentToUse = assignment;
          if (assignmentToUse.files) {
            assignmentToUse.files = await Promise.all(assignmentToUse.files.map(async (file: any) => {
              return await File.findById(file);
            }));
          }
        }
      }

      this.assignments = [];
      if (assignmentToUse) {
        this.assignments.push(assignmentToUse);
      }
    } else {
      for (const assignment of this.assignments) {
        assignment.files = await Promise.all(assignment.files.map(async (file: any) => {
          return await File.findById(file);
        }));

        assignment.user = await User.findById(assignment.user._id);
      }


    }
  }
  return this;
};

export {assignmentsSchema, IAssignmentUnitModel};
