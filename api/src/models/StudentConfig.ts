import * as mongoose from 'mongoose';
import {IStudentConfig} from '../../../shared/models/IStudentConfig';

interface IStudentConfigModel extends IStudentConfig, mongoose.Document {
}

const studentConfigSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
  },
  lastVisitedCourses: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
    }
  ]
});

const StudentConfig = mongoose.model<IStudentConfigModel>('StudentConfig', studentConfigSchema);

export {StudentConfig, studentConfigSchema};
