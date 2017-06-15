import {IUser} from './IUser';
import {ILecture} from './ILecture';
import {IWUser} from './IWUser';

export interface ICourse {
    _id: any;
    name: string;
    active: boolean;
    description: string;
    courseAdmin: IUser;
    students: IUser[];
    lectures: ILecture[];
    accessKey: string;
    whitelist: IWUser[];
}
