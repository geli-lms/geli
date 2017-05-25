import {ITaskUnit} from '../../../../../shared/models/units/ITaskUnit';
import {ITask} from '../../../../../shared/models/ITask';

export class TaskUnit implements ITaskUnit {
  _id: any;
  type: string;
  progressable: boolean;
  weight: number;

  tasks: ITask[];
}
