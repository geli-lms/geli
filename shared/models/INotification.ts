import {IUser} from './IUser';
import {IUnit} from './units/IUnit';
import {ILecture} from './ILecture';
import {ICourse} from './ICourse';

export interface INotification {
  _id: any;
  user: IUser;
  changedCourse: ICourse;
  changedLecture: ILecture;
  changedUnit: IUnit;
  text: string;
  isOld: boolean;
}
