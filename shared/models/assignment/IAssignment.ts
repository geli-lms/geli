import {IUser} from '../IUser';
import {IFile} from '../IFile';

export interface IAssignment {
    files: any[];
    user: IUser;
    submitted: boolean;
    submittedDate: Date;
    checked: Number;
}

