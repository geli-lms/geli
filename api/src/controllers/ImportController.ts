import {Authorized, CurrentUser, JsonController, Param, Post, UploadedFile, UseBefore} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {Course} from '../models/Course';
import {Lecture} from '../models/Lecture';
import {Unit} from '../models/units/Unit';
import {IUser} from '../../../shared/models/IUser';
import {UnitClassMapper} from '../utilities/UnitClassMapper';

@JsonController('/import')
@UseBefore(passportJwtMiddleware)
@Authorized(['teacher', 'admin'])
export class ImportController {

  @Post('/course')
  async importCourse(@UploadedFile('file') file: any,
                     @CurrentUser() user: IUser) {
    const courseDesc = JSON.parse(file.buffer.toString());
    return Course.schema.statics.importJSON(courseDesc, user);
  }

  @Post('/lecture/:course')
  async importLecture(@UploadedFile('file') file: any,
                      @Param('course') courseId: string) {
    const lectureDesc = JSON.parse(file.buffer.toString());
    return Lecture.schema.statics.importJSON(lectureDesc, courseId);
  }

  @Post('/unit/:course/:lecture')
  async importUnit(@UploadedFile('file') file: any,
                   @Param('course') courseId: string,
                   @Param('lecture') lectureId: string) {
    const unitDesc = JSON.parse(file.buffer.toString());
    const unitTypeClass = UnitClassMapper.getMongooseClassForUnit(unitDesc);
    return unitTypeClass.schema.statics.importJSON(unitDesc, courseId, lectureId);
  }
}
