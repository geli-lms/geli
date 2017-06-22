import {IUser} from './IUser';
import {ILecture} from './ILecture';
import {IWhitelistUser} from './IWhitelistUser';

export interface ICourse {
    _id: any;
    name: string;
    active: boolean;
    description: string;
    courseAdmin: IUser;
    students: IUser[];
    lectures: ILecture[];
    accessKey: string;
    whitelist: IWhitelistUser[];
    enrollType: string;
}
