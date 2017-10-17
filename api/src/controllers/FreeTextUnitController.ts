import {Body, Post, JsonController, UseBefore, BadRequestError, Param, Put, Authorized} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {UnitBaseController} from './UnitBaseController';
import {FreeTextUnit} from '../models/units/FreeTextUnit';
import {IFreeTextUnit} from '../../../shared/models/units/IFreeTextUnit';

@JsonController('/units/free-texts')
@UseBefore(passportJwtMiddleware)
@Authorized(['teacher', 'admin'])
export class FreeTextUnitController extends UnitBaseController {

  @Post('/')
  addUnit(@Body() data: any) {
    // discard invalid requests
    this.checkPostParam(data);

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
