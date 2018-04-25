import {ITaskUnitProgress} from '../../../../../../shared/models/progress/ITaskUnitProgress';
import {IUnit} from '../../../../../../shared/models/units/IUnit';

export class TaskUnitProgress implements ITaskUnitProgress {
  _id: any;
  answers: any;
  course: any;
  unit: any;
  user: any;
  done: boolean;
  type: string;
  __t: string;

  constructor(unit: IUnit) {
    this.unit = unit;
    this.course = unit._course;
    this.answers = {};
    this.__t = 'task-unit-progress';
  }
}
