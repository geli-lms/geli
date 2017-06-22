import {ICodeKataUnit} from '../../../../../shared/models/units/ICodeKataUnit';
import {ICourse} from '../../../../../shared/models/ICourse';

export class CodeKataUnit implements ICodeKataUnit {
  name: string;
  description: string;
  _course: any;
  _id: any;
  type: string;
  progressable: boolean;
  weight: number;
  updatedAt: string;
  createdAt: string;

  definition: string;
  code: string;
  test: string;

  constructor(_course: ICourse) {
    this._course = _course;
    this.progressable = true;
    this.weight = 0;
  }
}
