import {IFile} from './IFile';
import {ICourse} from './ICourse';

export interface IUser {
  _id: any;
  uid: string;
  email: string;
  password: string;
  profile: {
    firstName: string,
    lastName: string;
    picture: IFile
  };
  role: string;
  progress: any;
  lastVisitedCourses: Array<string>;
}
