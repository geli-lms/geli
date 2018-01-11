import {IFile} from './IFile';

export interface IDirectory {
  _id: any;
  name: string;
  subDirectories: IDirectory[];
  files: IFile[];
}
