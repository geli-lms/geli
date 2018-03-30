import {IUnit} from './IUnit';
import {IFile} from '../mediaManager/IFile';


export interface IVideoUnit extends IUnit {
  files: IFile[];
}
