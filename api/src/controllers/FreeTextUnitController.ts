import {Body, Post, JsonController, UseBefore, BadRequestError, Param, Put, Authorized} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {UnitController} from './UnitController';
import {FreeTextUnit} from '../models/units/FreeTextUnit';
import {IFreeTextUnit} from '../../../shared/models/units/IFreeTextUnit';

@JsonController('/units/free-texts')
@UseBefore(passportJwtMiddleware)
@Authorized('teacher')
export class FreeTextUnitController extends UnitController {

  @Post('/')
  addUnit(@Body() data: any) {
    // discard invalid requests
    if (!data.lectureId) {
      return new BadRequestError('No lecture ID was submitted.');
    }

    if (!data.model) {
      return new BadRequestError('No free-text unit was submitted.');
    }

    return new FreeTextUnit(data.model).save()
      .then((savedFreeTextUnit) => {
        return this.pushToLecture(data.lectureId, savedFreeTextUnit);
      });
  }

  @Put('/:id')
  updateUnit(@Param('id') id: string, @Body() unit: IFreeTextUnit) {
    return FreeTextUnit.findByIdAndUpdate(id, unit)
      .then((u) => u.toObject());
  }
}
