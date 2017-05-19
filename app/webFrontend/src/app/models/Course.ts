import {ICourse} from '../../../../../shared/models/ICourse';
import {User} from './User';
import {Lecture} from './Lecture';
/**
 * Created by olineff on 19.05.2017.
 */
export class Course implements ICourse {
  _id: any;
  name: string;
  active: boolean;
  description: string;
  courseAdmin: User;
  students: User[];
  lectures: Lecture[];

  constructor(course: ICourse) {
    this._id = course._id;
    this.name = course.name;
    this.active = course.active;
    this.description = course.description;
    this.courseAdmin = new User(course.courseAdmin);
    this.students = course.students.map(obj => new User(obj));
    this.lectures = course.lectures.map(obj => new Lecture(obj));
  }
}
