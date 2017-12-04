import {ICourse} from '../ICourse';

export interface IUnit {
    _id: any;
    _course: any;
    name: string;
    description: string;
    unitType: string;
    progressable: boolean;
    progressData?: any;
    weight: number;
    updatedAt: string;
    createdAt: string;
}
