import {IUser} from '../IUser';
import {IFile} from '../IFile';

export interface IAssignment {
  _id: string;
  files: any[];
  user: IUser;
  submitted: boolean;
  submittedDate: Date;
  checked: Number;
}

