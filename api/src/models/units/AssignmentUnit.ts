import * as mongoose from 'mongoose';
import {IAssignmentUnit} from '../../../../shared/models/units/IAssignmentUnit';
import {Unit} from './Unit';

interface IAssignmentUnitModel extends IAssignmentUnit, mongoose.Document {
  // secureData: (user: IUser) => Promise<IAssignmentUnit>;
}

const assignmentsSchema = new mongoose.Schema(
    {
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
    }, {
        timestamps: true,
        toObject: {
            transform: function (doc: any, ret: any) {
                if (ret.hasOwnProperty('_id') && ret._id !== null) {
                    ret._id =  ret._id.toString();
                }

                if (ret.hasOwnProperty('id') && ret.id !== null) {
                    ret.id = ret.id.toString();
                }
            }
        }
    }
);

const assignmentSchema = new mongoose.Schema({
    deadline: {
      type: String
    },
    assignments: [assignmentsSchema]
  },
);

// assignmentSchema.methods.secureData = async function (user: IUser): Promise<IAssignmentUnit> {
//   if (user.role === 'student') {
//     const assignment = this.assignments.filter(user);
//     this.assignments = assignment;
//   }
//   return this;
// };

export {assignmentSchema, IAssignmentUnitModel};
