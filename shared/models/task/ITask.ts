import {IAnswer} from './IAnswer';

export interface ITask {
    _id: any;
    name: string;
    answers: IAnswer[];
}
/*
export interface ITaskAnswer {
  value: boolean;
  text: string;
}
*/
