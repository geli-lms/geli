// TODO must related connected to a lecture

import {ITask} from '../../../../../shared/models/task/ITask';
import {IAnswer} from '../../../../../shared/models/task/IAnswer';

export class Task implements ITask {
  _id: any;
  name: string;
  answers: IAnswer[] = [];
}

