import {IFileUnit} from '../../../../../../shared/models/units/IFileUnit';
import {IFile} from '../../../../../../shared/models/IFile';
import {ICourse} from '../../../../../../shared/models/ICourse';

export class FileUnit implements IFileUnit {
  _id: any;
  _course: any;
  name: string;
  description: string;
  unitType: string;
  progressable: boolean;
  weight: number;
  updatedAt: string;
  createdAt: string;

  files: IFile[];
  fileUnitType: string;

  constructor(_course: ICourse) {
    this._course = _course;
    this.fileUnitType = 'file';
    this.progressable = false;
    this.weight = 0;
  }
}
