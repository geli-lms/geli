import {IUnit} from './IUnit';
import {IUser} from '../IUser';
import {IFile} from '../mediaManager/IFile';

export interface IAssignmentUnit extends IUnit {
  deadline: string;
  assignments: [
    file: IFile;
    user: IUser;
    submitted: boolean;
    checked: Integer;  // 0 = not checked; 1 = Not ok; 2 = ok
    ];
}
