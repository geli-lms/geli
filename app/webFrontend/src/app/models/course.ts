import {ICourse} from "../../../../../shared/models/ICourse";
import {IUser} from "../../../../../shared/models/IUser";
import {ILecture} from "../../../../../shared/models/ILecture";

export class Course implements ICourse{
  _id: any;
  active: boolean;
  courseAdmin: IUser;
  students: IUser[];
  lectures: ILecture[];
  name: string;
  description: string;
  teacher: string;

  constructor(name: string, description: string, teacher: string) {
    this.name = name;
    this.description = description;
    this.teacher = teacher;
  }
}
