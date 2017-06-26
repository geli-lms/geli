import {ITask} from '../../../../../shared/models/task/ITask';
export class Task implements ITask {
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

