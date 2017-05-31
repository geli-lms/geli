import {ICourse} from '../ICourse';

export interface IUnit {
    _id: any;
    _course: any;
    title: string;
    type: string;
    progressable: boolean;
    weight: number;
}
