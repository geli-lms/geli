import {ICodeKataUnitProgress} from '../../../../../../shared/models/progress/ICodeKataProgress';
import {IUnit} from '../../../../../../shared/models/units/IUnit';

export class CodeKataUnitProgress implements ICodeKataUnitProgress {
  _id: any;
  code: string;
  course: any;
  unit: any;
  user: any;
  done: boolean;
  type: string;
  __t: string;

  constructor(unit: IUnit) {
    this.unit = unit;
    this.course = this.unit._course;
    this.code = '';
    this.__t = 'codeKata';
  }
}
