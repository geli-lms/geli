import {IProgress} from './IProgress';
import {IFile} from './IFile';
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
  progress: IProgress[];
}
