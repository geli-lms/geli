import {IUnit} from '../../../../../shared/models/IUnit';
/**
 * Created by olineff on 19.05.2017.
 */
export class Unit implements IUnit {
  _id: any;
  type: string;
  filePath: string;
  fileName: string;

  constructor(unit: IUnit) {
    this._id = unit._id;
    this.type = unit.type;
    this.fileName = unit.fileName;
    this.filePath = unit.filePath;
  }
}
