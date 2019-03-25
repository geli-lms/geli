import {IDirectory} from '../../../../../../shared/models/mediaManager/IDirectory';
import {IFile} from '../../../../../../shared/models/mediaManager/IFile';

export class Directory implements IDirectory {
  _id: any;
  _course: any;
  name: string;
  subDirectories: IDirectory[];
  files: IFile[];

  public Directory(directory: IDirectory) {
    this._id = directory._id;
    this.name = directory.name;
    this.subDirectories = directory.subDirectories;
    this.files = directory.files;
  }
}
