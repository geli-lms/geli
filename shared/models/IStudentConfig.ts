import {IUser} from './IUser';
import {ICourse} from './ICourse';

export interface IStudentConfig {
  user: IUser;
  lastVisitedCourse: ICourse;
}
