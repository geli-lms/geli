import {ICourse} from './ICourse';

export interface ITask {
    _id: any;
    name: string;
    courseId: ICourse;
}
