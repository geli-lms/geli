import {IFile} from './IFile';
export interface IUser {
  _id: any;
  uid: string;
  email: string;
  password: string;
  profile: {
    firstName: string,
    lastName: string;
    picture: IFile;
    theme: string;
  };
  role: string;
  progress: any;
  lastVisitedCourses: Array<string>;
}
