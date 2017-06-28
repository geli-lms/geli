import {ITask} from './task/ITask';
import {IUser} from './IUser';
import {ITaskUnit} from './units/ITaskUnit';

export interface ITaskAttestation {
  _id: any;
  taskUnitId: ITaskUnit;
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
