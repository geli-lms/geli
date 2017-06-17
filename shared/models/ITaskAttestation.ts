import {ITask} from './task/ITask';
import {IUser} from './IUser';

export interface ITaskAttestation {
  _id: any;
  taskId: ITask; // TODO string here ?

  // attestations: [
   //  {
     //  _id: any;
      student: IUser;
      question: string;
      answers: [
        {
          _id: any;
          value: Boolean,
          text: String
        }
      ];
      correctAnswered: boolean;

  //  }
  //  ];
}
/*
 export interface ITaskAnswer {
 value: boolean;
 text: string;
 }
 */
