import {ITaskUnit} from '../../../../../../shared/models/units/ITaskUnit';
import {ITask} from '../../../../../../shared/models/task/ITask';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {IChatRoom} from '../../../../../../shared/models/IChatRoom';

export class TaskUnit implements ITaskUnit {
  name: string;
  description: string;
  updatedAt: string;
  createdAt: string;
  _course: any;
  _id: any;
  title: string;
  type: string;
  __t: string;
  progressable: boolean;
  weight: number;
  visible: boolean;
  unitCreator: any;
  chatRoom: IChatRoom;

  tasks: ITask[] = [];
  deadline: string;

  constructor(_course: ICourse) {
    this._course = _course;
    this.progressable = true;
    this.weight = 0;
    this.__t = 'task';
  }
}
