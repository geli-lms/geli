import * as mongoose from 'mongoose';
import {IAssignmentUnit} from '../../../../shared/models/units/IAssignmentUnit';
import {IUser} from '../../../../shared/models/IUser';
import {IUnitModel, Unit} from './Unit';
import {ICourseModel} from "../Course";
import {File} from '../mediaManager/File';

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

assignmentsSchema.pre('save', function() {
  const localUnit = <IAssignmentUnitModel><any>this;
  if (localUnit.assignments === null) {
    localUnit.assignments = [];
  }
  });


assignmentsSchema.methods.secureData = async function (user: IUser): Promise<IAssignmentUnit> {
   if (user.role === 'student' && this.assignments.length) {

     let assignmentToUse;

     for(const assignment of this.assignments) {
       if(assignment.user._id.toString() === user._id) {
         assignmentToUse = assignment;
         assignmentToUse.file = await File.findById(assignment.file._id);
       }
     }

     this.assignments = [];
     if (assignmentToUse) {
       this.assignments.push(assignmentToUse);
     }
   }
   return this;
};

export {assignmentsSchema, IAssignmentUnitModel};
