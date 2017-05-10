import {ILecture} from '../../../../../shared/models/ILecture';
import {IUnit} from '../../../../../shared/models/IUnit';

export class Lecture implements ILecture{
  _id: any;
  name: string;
  description: string;
  units: IUnit[];
}
