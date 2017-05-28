import {ICourse} from '../ICourse';

export interface IUnit {
    _id: any;
    _course: any;
    type: string;
    progressable: boolean;
    weight: number;
}
