import {IFileUnit} from '../../../../../../shared/models/units/IFileUnit';
import {IFile} from '../../../../../../shared/models/mediaManager/IFile';
import {ICourse} from '../../../../../../shared/models/ICourse';

export class FileUnit implements IFileUnit {
  _id: any;
  _course: any;
  name: string;
  description: string;
  type: string;
  __t: string;
  progressable: boolean;
  weight: number;
  updatedAt: string;
  createdAt: string;

  files: IFile[] = [];
  fileUnitType: string;

  constructor(_course: ICourse) {
    this._course = _course;
    this.__t = 'file';
    this.fileUnitType = 'file';
    this.progressable = false;
    this.weight = 0;
  }
}
