import {ITask} from './task/ITask';
import {IUser} from './IUser';

export interface ITaskAttestation {
  _id: any;
  taskId: ITask;

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

}
