import {INotification} from '../../../../../shared/models/INotification';
import {ICourse} from '../../../../../shared/models/ICourse';
import {IUser} from '../../../../../shared/models/IUser';
import {ILecture} from '../../../../../shared/models/ILecture';
import {IUnit} from '../../../../../shared/models/units/IUnit';

export class Notification implements INotification {
  _id: any;
  user: IUser;
  changedCourse: ICourse;
  changedLecture: ILecture;
  changedUnit: IUnit;
  text: string;
  isOld: boolean;

  constructor(user: IUser, changedCourse: ICourse, changedLecture: ILecture, changedUnit: IUnit, text: string) {
    this.user = user;
    this.changedCourse = changedCourse;
    this.changedLecture = changedLecture;
    this.changedUnit = changedUnit;
    this.text = text;
  }
}
