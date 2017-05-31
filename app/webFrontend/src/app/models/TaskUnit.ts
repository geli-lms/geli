import {ITaskUnit} from '../../../../../shared/models/units/ITaskUnit';
import {ITask} from '../../../../../shared/models/task/ITask';
import {ICourse} from '../../../../../shared/models/ICourse';

export class TaskUnit implements ITaskUnit {
  _course: any;
  _id: any;
  title: string;
  type: string;
  progressable: boolean;
  weight: number;

  tasks: ITask[] = [];

  constructor(_course: ICourse) {
    this._course = _course;
    this.progressable = true;
    this.weight = 0;
  }
}
