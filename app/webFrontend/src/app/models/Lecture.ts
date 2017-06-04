import {ILecture} from '../../../../../shared/models/ILecture';
import {IUnit} from '../../../../../shared/models/units/IUnit';

export class Lecture implements ILecture {
  _id: any;
  name: string;
  description: string;
  units: IUnit[];
}
