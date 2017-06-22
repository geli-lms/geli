import {Body, Post, JsonController, UseBefore, BadRequestError, Put, Param} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {UnitController} from './UnitController';
import {CodeKataUnit} from '../models/units/CodeKataUnit';
import {ICodeKataUnit} from "../../../shared/models/units/ICodeKataUnit";

@JsonController('/units/codekata')
@UseBefore(passportJwtMiddleware)
export class CodeKataUnitController extends UnitController {

  @Post('/')
  addCodeKataUnit(@Body() data: any) {
    // discard invalid requests
    if (!data.lectureId) {
      return new BadRequestError('No lecture ID was submitted.');
    }

    if (!data.model) {
      return new BadRequestError('No codekata unit was submitted.');
    }

    return new Promise((resolve) => {
      resolve(new CodeKataUnit(data.model).save());
    })
      .then((savedCodeKataUnit) => {
        return this.pushToLecture(data.lectureId, savedCodeKataUnit);
      });
  }

  @Put('/:id')
  updateCodeKataUnit(@Param('id') id: string, @Body() unit: ICodeKataUnit) {
    return CodeKataUnit.findByIdAndUpdate(id, unit)
      .then(u => u.toObject());
  }
}
