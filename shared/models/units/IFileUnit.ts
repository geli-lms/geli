import {IUnit} from './IUnit';
import {IFile} from '../mediaManager/IFile';


export interface IFileUnit extends IUnit {
  files: IFile[];
  fileUnitType: string;
}
