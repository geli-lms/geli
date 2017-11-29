import {IUser} from './IUser';
import {ILecture} from './ILecture';
import {IWhitelistUser} from './IWhitelistUser';

export const ENROLL_TYPE_WHITELIST = 'whitelist';
export const ENROLL_TYPE_FREE = 'free';
export const ENROLL_TYPE_ACCESSKEY = 'accesskey';
export const ENROLL_TYPES = [ENROLL_TYPE_WHITELIST, ENROLL_TYPE_FREE, ENROLL_TYPE_ACCESSKEY];

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
    whitelist: IWhitelistUser[];
    enrollType: string;
    hasAccessKey: boolean;
}
