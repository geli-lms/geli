import {IUnit} from './IUnit';
import {IFile} from '../IFile';


export interface IFileUnit extends IUnit {
  files: IFile[];
}
