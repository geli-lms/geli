import * as mongoose from 'mongoose';
import {IProgress} from '../../../../shared/models/progress/IProgress';
import {codeKataProgressSchema} from './CodeKataProgress';
import {ITaskUnitProgressModel, taskUnitProgressSchema} from './TaskUnitProgress';
import {IUser} from '../../../../shared/models/IUser';
import {ICourseModel} from '../Course';
import {IUnitModel} from '../units/Unit';

interface IProgressModel extends IProgress, mongoose.Document {
  exportJSON: () => Promise<IProgress>;
}

interface IProgressMongoose extends mongoose.Model<IProgressModel> {
  exportPersonalUserData: (user: IUser) => Promise<IProgress>;
}

let Progress: IProgressMongoose;

const progressSchema = new mongoose.Schema({
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unit'
    },
    done: {
      type: Boolean
    },
    type: {
      type: String
    }
  },
  {
    timestamps: true,
    toObject: {
      transform: function (doc: any, ret: any) {
        ret._id = ret._id.toString();

        if (!doc.populated('course') && ret.course) {
          ret.course = ret.course.toString();
        }

        if (!doc.populated('user') && ret.user) {
          ret.user = ret.user.toString();
        }

        if (!doc.populated('unit') && ret.unit) {
          ret.unit = ret.unit.toString();
        }
      }
    }
  }
);

progressSchema.methods.exportJSON = async function () {
  const obj = this.toObject();

  // remove unwanted informations
  // mongo properties
  delete obj._id;
  delete obj.createdAt;
  delete obj.__v;
  delete obj.updatedAt;

  // custom properties
  return obj;
};

progressSchema.statics.exportPersonalUserData = async function (user: IUser) {
  const userProgress = await Progress.find({'user': user._id}, '-user')
    .populate('course', 'name description')
    .populate('unit', 'name description');

  return Promise.all(userProgress.map( async (prog) => {
    let progExport;

    switch (prog.__t) {
      case 'task-unit-progress':
        progExport =  await (<ITaskUnitProgressModel>prog).exportJSON();
        break;
      default:
        progExport =  await (<IProgressModel>prog).exportJSON();
    }


    progExport.course = await (<ICourseModel>prog.course).exportJSON(true, true);
    progExport.unit = await (<IUnitModel>prog.unit).exportJSON(true);
    return progExport;
  }));
};



Progress = mongoose.model<IProgressModel, IProgressMongoose>('Progress', progressSchema);
const CodeKataProgress = Progress.discriminator('codeKata', codeKataProgressSchema);
const TaskUnitProgress = Progress.discriminator('task-unit-progress', taskUnitProgressSchema);

export {Progress, IProgressModel};
