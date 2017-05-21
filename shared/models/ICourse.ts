import {IUser} from './IUser';
import {ILecture} from './ILecture';

export interface ICourse {
    _id: any;
    name: string;
    active: boolean;
    description: string;
    courseAdmins: IUser[];
    students: IUser[];
    lectures: ILecture[];
}
