// import {IAnswer} from './IAnswer';

export interface ITask {
    _id: any;
    question: string;
    answers: [
      {
        _id: any;
        value: Boolean,
        text: String
      }
      ];
}
/*
export interface ITaskAnswer {
  value: boolean;
  text: string;
}
*/
