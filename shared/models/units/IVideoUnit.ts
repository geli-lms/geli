import {IUnit} from './IUnit';
import {IFile} from '../IFile';


export interface IVideoUnit extends IUnit {
  files: IFile[];
}
