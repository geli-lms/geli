import {Body, Post, JsonController, UseBefore, BadRequestError, Get, Param} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {UnitController} from './UnitController';
import {FreeTextUnit} from '../models/units/FreeTextUnit';

@JsonController('/units/free-texts')
@UseBefore(passportJwtMiddleware)
export class FreeTextUnitController extends UnitController {

  @Post('/')
  addFreeTextUnit(@Body() data: any) {
    // discard invalid requests
    if (!data.lectureId) {
      return new BadRequestError('No lecture ID was submitted.');
    }

    if (!data.freeTextUnit) {
      return new BadRequestError('No free-text unit was submitted.');
    }

    return new Promise((resolve) => {
      resolve(new FreeTextUnit(data.freeTextUnit).save());
    })
      .then((savedFreeTextUnit) => {
        return this.pushToLecture(data.lectureId, savedFreeTextUnit);
      });
  }

  @Get('/course/:courseId')
  getFreeTextForCourse(@Param('courseId') courseId: string) {
    return FreeTextUnit.find().where({courseId: courseId}).sort({createdAt: -1});
  }
}
