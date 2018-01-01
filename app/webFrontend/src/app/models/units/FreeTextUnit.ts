import {ICourse} from '../../../../../../shared/models/ICourse';
import {IFreeTextUnit} from '../../../../../../shared/models/units/IFreeTextUnit';

export class FreeTextUnit implements IFreeTextUnit {
  name: string;
  description: string;
  updatedAt: string;
  createdAt: string;
  _course: any;
  _id: any;
  type: string;
  __t: string;
  progressable: boolean;
  weight: number;

  markdown: string;

  constructor(_course: ICourse) {
    this._course = _course;
    this.progressable = false;
    this.weight = 0;
    this.__t = 'free-text';
  }
}
