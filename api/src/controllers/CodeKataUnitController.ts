import {Body, Post, JsonController, UseBefore, BadRequestError} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {UnitController} from './UnitController';
import {CodeKataUnit} from '../models/units/CodeKataUnit';

@JsonController('/units/codekata')
@UseBefore(passportJwtMiddleware)
export class CodeKataUnitController extends UnitController {

  @Post('/')
  addCodeKataUnit(@Body() data: any) {
    // discard invalid requests
    if (!data.lectureId) {
      return new BadRequestError('No lecture ID was submitted.');
    }

    if (!data.codeKataUnit) {
      return new BadRequestError('No codekata unit was submitted.');
    }

    return new CodeKataUnit(data.codeKataUnit).save().then((savedCodeKataUnit) => {
      this.pushToLecture(data.lectureId, savedCodeKataUnit);
    });
  }
}
