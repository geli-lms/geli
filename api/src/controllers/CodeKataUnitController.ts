import {Body, Post, JsonController, UseBefore, Put, Param, Authorized, BadRequestError} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {UnitBaseController} from './UnitBaseController';
import {CodeKataUnit} from '../models/units/CodeKataUnit';
import {ICodeKataUnit} from '../../../shared/models/units/ICodeKataUnit';

@JsonController('/units/code-katas')
@UseBefore(passportJwtMiddleware)
export class CodeKataUnitController extends UnitBaseController {

  @Authorized(['admin', 'teacher'])
  @Post('/')
  addCodeKataUnit(@Body() data: any) {
    // discard invalid requests
    this.checkPostParam(data);

    data.model = this.splitCodeAreas(data.model);
    this.validateKata(data.model);

    return new CodeKataUnit(data.model).save()
      .then((savedCodeKataUnit) => {
        return this.pushToLecture(data.lectureId, savedCodeKataUnit);
      });
  }

  @Authorized(['admin', 'teacher'])
  @Put('/:id')
  updateCodeKataUnit(@Param('id') id: string, @Body() unit: ICodeKataUnit) {
    unit = this.splitCodeAreas(unit);
    this.validateKata(unit);
    return CodeKataUnit.findByIdAndUpdate(id, unit, {new: true})
      .then(u => u.toObject());
  }

  private validateKata(unit: ICodeKataUnit) {
    if (!unit.definition || !unit.code || !unit.test) {
      throw new BadRequestError('A Kata must at least contain 3 areas');
    }

    if (!unit.test.match(new RegExp('function(.|\t)*validate\\(\\)(.|\n|\t)*{(.|\n|\t)*}', 'gmi'))) {
      throw new BadRequestError('The test section must contain a validate function');
    }
    if (!unit.test.match(new RegExp('function(.|\t)*validate\\(\\)(.|\n|\t)*{(.|\n|\t)*return(.|\n|\t)*}', 'gmi'))) {
      throw new BadRequestError('The validate function must return something');
    }
    if (!unit.test.match(new RegExp('validate\\(\\);', 'gmi'))) {
      throw new BadRequestError('The test section must call the validate function');
    }
  }

  private splitCodeAreas(unit: ICodeKataUnit): ICodeKataUnit {
    if (unit.definition !== undefined || unit.test !== undefined || unit.code === undefined) {
      return unit;
    }

    const separator = '\/\/#+';
    const firstSeparator: number = this.findFirstIndexOf(unit.code, separator);
    const lastSeparator: number = this.findLastIndexOf(unit.code, separator);

    unit.definition = unit.code.substring(0, firstSeparator).trim();
    unit.test = unit.code.substring(lastSeparator, unit.code.length).trim();
    unit.code = unit.code.substring(firstSeparator, lastSeparator).trim();

    unit.code = unit.code.slice(unit.code.search('\n')).trim();
    unit.test = unit.test.slice(unit.test.search('\n')).trim();

    return unit;
  }

  private findFirstIndexOf(source: string, value: string): number {
    return source.search(value);
  }

  private findLastIndexOf(source: string, value: string): number {
    const regex = new RegExp(value, '');
    let i = -1;

    // limit execution time (prevent deadlocks)
    let j = 10;
    while (j > 0) {
      j--;
      const result = regex.exec(source.slice(++i));
      if (result != null) {
        i += result.index;
      } else {
        i--;
        break;
      }
    }
    return i;
  }
}
