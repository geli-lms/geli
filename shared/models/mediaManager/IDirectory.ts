import {IFile} from './IFile';

export interface IDirectory {
  _id: any;
  _course: any;
  name: string;
  subDirectories: IDirectory[];
  files: IFile[];
}
