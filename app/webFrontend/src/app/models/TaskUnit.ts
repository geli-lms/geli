import {ITaskUnit} from '../../../../../shared/models/units/ITaskUnit';
import {ITask} from '../../../../../shared/models/task/ITask';

export class TaskUnit implements ITaskUnit {
  _id: any;
  type: string;
  progressable: true;
  weight: 0;

  tasks: ITask[] = [];
}
