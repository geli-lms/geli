import {ICourse} from './ICourse';

export interface ITask {
    _id: any;
    name: string;
    answers: [
    {
      _id: any;
      value: boolean,
      text: string
    }
    ];
}
/*
export interface ITaskAnswer {
  value: boolean;
  text: string;
}
*/
