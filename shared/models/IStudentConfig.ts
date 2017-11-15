import {IUser} from './IUser';
import {ICourse} from "./ICourse";

export interface IStudentConfig {
  _user: IUser;
  lastVisitedCourse: ICourse;
}
