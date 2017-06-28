import {IUser} from './IUser';
import {ILecture} from './ILecture';

export interface ICourse {
    _id: any;
    name: string;
    active: boolean;
    description: string;
    courseAdmin: IUser;
    teachers: IUser[];
    students: IUser[];
    lectures: ILecture[];
    accessKey: string;
}
