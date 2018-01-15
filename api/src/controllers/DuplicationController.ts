import {Request} from 'express';
import {
  Body, Post, Param, Req, JsonController, UseBefore, Authorized, InternalServerError
} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {IUnit} from '../../../shared/models/units/IUnit';
import {ILectureModel, Lecture} from '../models/Lecture';
import {IUnitModel, Unit} from '../models/units/Unit';
import {Course, ICourseModel} from '../models/Course';
import {ILecture} from '../../../shared/models/ILecture';
import {ICourse} from '../../../shared/models/ICourse';


@JsonController('/duplicate')
@UseBefore(passportJwtMiddleware)
@Authorized(['teacher', 'admin'])
export class DuplicationController {

  @Post('/course/:id')
  async duplicateCourse(@Param('id') id: string, @Body() data: any, @Req() request: Request) {
    // we could use @CurrentUser instead of the need to explicitly provide a teacher
    const courseAdmin = data.courseAdmin;
    try {
      const courseModel: ICourseModel = await Course.findById(id);
      const exportedCourse: ICourse = await courseModel.exportJSON();
      return Course.schema.statics.importJSON(exportedCourse, courseAdmin);
    } catch (err) {
        const newError = new InternalServerError('Failed to duplicate course');
        newError.stack += '\nCaused by: ' + err.message + '\n' + err.stack;
        throw newError;
    }
  }

  @Post('/lecture/:id')
  async duplicateLecture(@Param('id') id: string, @Body() data: any, @Req() request: Request) {
    const courseId = data.courseId;
    try {
      const lectureModel: ILectureModel = await Lecture.findById(id);
      const exportedLecture: ILecture = await lectureModel.exportJSON();
      return Lecture.schema.statics.importJSON(exportedLecture, courseId);
    } catch (err) {
      const newError = new InternalServerError('Failed to duplicate lecture');
      newError.stack += '\nCaused by: ' + err.message + '\n' + err.stack;
      throw newError;
    }
  }

  @Post('/unit/:id')
  async duplicateUnit(@Param('id') id: string, @Body() data: any, @Req() request: Request) {
    const courseId = data.courseId;
    const lectureId = data.lectureId;
    try {
      const unitModel: IUnitModel = await Unit.findById(id);
      const exportedUnit: IUnit = await unitModel.exportJSON();
      return Unit.schema.statics.importJSON(exportedUnit, courseId, lectureId);
    } catch (err) {
      const newError = new InternalServerError('Failed to duplicate unit');
      newError.stack += '\nCaused by: ' + err.message + '\n' + err.stack;
      throw newError;
    }
  }

}
