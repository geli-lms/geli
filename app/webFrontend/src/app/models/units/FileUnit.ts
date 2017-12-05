import {IFileUnit} from '../../../../../../shared/models/units/IFileUnit';
import {IFile} from '../../../../../../shared/models/IFile';

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

  constructor() {
    this.fileUnitType = 'file';
    this.progressable = false;
    this.weight = 0;
  }
}
