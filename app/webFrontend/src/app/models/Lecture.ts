import {ILecture} from '../../../../../shared/models/ILecture';
import {IUnit} from '../../../../../shared/models/IUnit';
import {Unit} from './Unit';

export class Lecture implements ILecture {
  _id: any;
  name: string;
  description: string;
  units: IUnit[];

  constructor();
  constructor(obj: ILecture);
  constructor(obj?: any) {
    this._id = obj && obj._id || null;
    this.name = obj && obj.name || '';
    this.description = obj && obj.description || '';
    this.units = obj && obj.units.map(e => new Unit(e)) || [];
  }
}
