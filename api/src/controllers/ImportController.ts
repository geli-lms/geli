import {Authorized, Body, CurrentUser, JsonController, Param, Post, UseBefore} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {Course} from '../models/Course';
import {Lecture} from '../models/Lecture';
import {Unit} from '../models/units/Unit';
import {IUser} from '../../../shared/models/IUser';

@JsonController('/importTest')
@UseBefore(passportJwtMiddleware)
@Authorized(['teacher', 'admin'])
export class ImportController {

  @Post('/course')
  async importCourse(@Body() body: any, @CurrentUser() user: IUser) {
    return Course.prototype.importJSON(body, user);
  }

  @Post('/lecture/:course')
  async importLecture(@Body() body: any,
                      @Param('course') courseId: string) {
    return Lecture.prototype.importJSON(body, courseId);
  }

  @Post('/unit/:course/:lecture')
  async importUnit(@Body() body: any,
                   @Param('course') courseId: string,
                   @Param('lecture') lectureId: string) {
    return Unit.prototype.importJSON(body, courseId, lectureId);
  }
}
