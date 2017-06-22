import {Body, Post, JsonController, UseBefore, BadRequestError, Put, Param} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {UnitController} from './UnitController';
import {CodeKataUnit} from '../models/units/CodeKataUnit';
import {ICodeKataUnit} from '../../../shared/models/units/ICodeKataUnit';

@JsonController('/units/code-katas')
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
      data.model = this.splitCodeAreas(data.model);
      resolve(new CodeKataUnit(data.model).save());
    })
      .then((savedCodeKataUnit) => {
        return this.pushToLecture(data.lectureId, savedCodeKataUnit);
      });
  }

  @Put('/:id')
  updateCodeKataUnit(@Param('id') id: string, @Body() unit: ICodeKataUnit) {
    unit = this.splitCodeAreas(unit);
    return CodeKataUnit.findByIdAndUpdate(id, unit)
      .then(u => u.toObject());
  }

  private splitCodeAreas(unit: ICodeKataUnit): ICodeKataUnit {
    if (unit.definition !== undefined || unit.test !== undefined || unit.code === undefined) {
      return unit;
    }

    const seperator: string = '\/\/#+';
    let firstSeperator: number = this.findFirstIndexOf(unit.code, seperator);
    let lastSeperator: number = this.findLastIndexOf(unit.code, seperator);

    unit.definition = unit.code.substring(0, firstSeperator).trim();
    unit.test = unit.code.substring(lastSeperator, unit.code.length).trim();
    unit.code = unit.code.substring(firstSeperator, lastSeperator).trim();

    unit.code = unit.code.slice(unit.code.search('\n')).trim();
    unit.test = unit.test.slice(unit.test.search('\n')).trim();

    return unit;
  }

  private findFirstIndexOf(source: string, value: string): number {
    return source.search(value);
  }

  private findLastIndexOf(source: string, value: string): number {
    let regex = new RegExp(value, '');
    let i: number = -1;

    // limit execution time (prevent deadlocks)
    let j = 10;
    while (j > 0) {
      j--;
      let result = regex.exec(source.slice(++i));
      if (result != null) {
        i += result.index;
      }
      else {
        i--;
        break;
      }
    }
    return i;
  }
}
