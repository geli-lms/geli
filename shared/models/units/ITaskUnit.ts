import {IUnit} from './IUnit';
import {ITask} from '../task/ITask';

export interface ITaskUnit extends IUnit {
  tasks: ITask[];
  deadline: string;
}
