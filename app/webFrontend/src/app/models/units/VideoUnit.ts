import {FileUnit} from './FileUnit';

export class VideoUnit extends FileUnit {

  constructor() {
    super();
    this.fileUnitType = 'video';
  }
}
