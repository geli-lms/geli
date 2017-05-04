import {IUnit} from './IUnit';
export interface ILecture {
    _id: any;
    name: string;
    description: string;
    units: IUnit[];
}
