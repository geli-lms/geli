import {ICourse} from '../../../../../../shared/models/ICourse';
import {FileUnit} from './FileUnit';

export class VideoUnit extends FileUnit {

  constructor(_course: ICourse) {
    super(_course);
    this.fileUnitType = 'video';
  }
}
