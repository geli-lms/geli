import {IFile} from '../../../../../../shared/models/mediaManager/IFile';

export class File implements IFile {
  _id: any;
  name: string;
  physicalPath: string;
  size: number;
  mimeType: string;

  public File(file: IFile) {
    this._id = file._id;
    this.name = file.name;
    this.physicalPath = file.physicalPath;
    this.size = file.size;
    this.mimeType = file.mimeType;
  }
}
