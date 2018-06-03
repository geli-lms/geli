import {IUser} from "../IUser";
import {IFile} from "../IFile";

export interface IAssignment {
    file: IFile;
    user: IUser;
    submitted: boolean;
    checked: Number;
}

