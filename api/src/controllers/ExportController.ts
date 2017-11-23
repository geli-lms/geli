import {Authorized, Get, JsonController, Param, UseBefore} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {Course} from '../models/Course';
import {Lecture} from '../models/Lecture';
import {Unit} from '../models/units/Unit';

@JsonController('/export')
@UseBefore(passportJwtMiddleware)
@Authorized(['teacher', 'admin'])
export class ExportController {

  @Get('/course/:id')
  async exportCourse(@Param('id') id: string) {
    const course = await Course.findById(id);
    return course.export();
  }

  @Get('/lecture/:id')
  async exportLecture(@Param('id') id: string) {
    const lecture = await Lecture.findById(id);
    return lecture.export();
  }

  @Get('/unit/:id')
  async exportUnit(@Param('id') id: string) {
    const unit = await Unit.findById(id);
    return unit.export();
  }
}
