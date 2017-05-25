import {IUnit} from './IUnit';
import {ITask} from '../ITask';

export interface ITaskUnit extends IUnit {
  tasks: ITask[];
}
