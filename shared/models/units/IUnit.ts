import {ICourse} from '../ICourse';

export interface IUnit {
    _id: any;
    _course: any;
    name: string;
    description: string;
    type: string;
    progressable: boolean;
    weight: number;
    updatedAt: string;
    createdAt: string;
}
