import * as mongoose from 'mongoose';
import {IStudentConfig} from '../../../shared/models/IStudentConfig';

interface IStudentConfigModel extends IStudentConfig, mongoose.Document {
}

const studentConfigSchema = new mongoose.Schema({
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastVisitedCourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }
});


const StudentConfig = mongoose.model<IStudentConfigModel>('StudentCofig', studentConfigSchema);

export {StudentConfig, studentConfigSchema};
