import {IProgress} from './IProgress';
export interface IUser {
  _id: any;
  uid: string;
  email: string;
  password: string;
  profile: {
    firstName: string,
    lastName: string;
  };
  role: string;
  progress: IProgress[];
}
