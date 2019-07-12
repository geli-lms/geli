import {IFile} from '../../../../../../shared/models/mediaManager/IFile';

export class File implements IFile {
  _id: any;
  _course: any;
  name: string;
  link: string;
  size: number;
  mimeType: string;

  public File(file: IFile) {
    this._id = file._id;
    this.name = file.name;
    this.link = file.link;
    this.size = file.size;
    this.mimeType = file.mimeType;
  }
}
