import {ICourse} from '../../../../../shared/models/ICourse';
import {IUser} from '../../../../../shared/models/IUser';
import {ILecture} from '../../../../../shared/models/ILecture';
import {IWhitelistUser} from '../../../../../shared/models/IWhitelistUser';

/**
 * Created by Alexander on 23.05.2017.
 */
export class Course implements ICourse {
  _id: any;
  name: string;
  active: boolean;
  description: string;
  courseAdmin: IUser;
  teachers: IUser[];
  students: IUser[];
  lectures: ILecture[];
  whitelist: IWhitelistUser[];
  enrollType: string;
  accessKey: string;

  public Course(course: ICourse) {
    this._id = course._id;
    this.name = course.name;
    this.active = course.active;
    this.description = course.description;
    this.courseAdmin = course.courseAdmin;
    this.teachers = course.teachers;
    this.students = course.students;
    this.lectures = course.lectures;
    this.whitelist = course.whitelist;
    this.enrollType = course.enrollType;
  }
}
