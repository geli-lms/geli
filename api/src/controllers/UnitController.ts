import {Body, Get, Put, Delete, Param, JsonController, UseBefore} from 'routing-controllers';
import fs = require('fs');
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import markdownService from '../services/MarkdownService';

import {Lecture} from '../models/Lecture';
import {Unit} from '../models/units/Unit';
import {IUnit} from '../../../shared/models/units/IUnit';
import {IVideoUnitModel, VideoUnit} from '../models/units/VideoUnit';
import {FreeTextUnit, IFreeTextUnitModel} from '../models/units/FreeTextUnit';

const uploadOptions = {dest: 'uploads/'};

@JsonController('/units')
@UseBefore(passportJwtMiddleware)
export class UnitController {

  @Get('/:id')
  getUnit(@Param('id') id: string) {
    return Unit.findById(id)
      .then((u) => {
        if (u instanceof FreeTextUnit) {
          u = (<IFreeTextUnitModel>u);
          console.log(markdownService.mdToHtml((<IFreeTextUnitModel>u).markdown));
        }
        u.toObject();
      });
  }

  protected pushToLecture(lectureId: string, unit: any) {
    return Lecture.findById(lectureId)
      .then((lecture) => {
        lecture.units.push(unit);
        return lecture.save();
      })
      .then((lecture) => lecture.toObject());
  }

  @Put('/:id')
  updateUnit(@Param('id') id: string, @Body() unit: IUnit) {
    return Unit.findByIdAndUpdate(id, unit, {'new': true})
      .then((u) => u.toObject());
  }

  @Delete('/:id')
  deleteUnit(@Param('id') id: string) {
    return Unit.findById(id).then((unit) => {
      if (!unit) {
        throw new Error('No unit found for id');
      }

      if (unit instanceof VideoUnit && (<IVideoUnitModel>unit).filePath) {
        fs.unlinkSync((<IVideoUnitModel>unit).filePath);
      }
      return Lecture.update({}, {$pull: {units: id}});
    })
      .then(() => Unit.findByIdAndRemove(id))
      .then(() => {
        return {result: true};
      });
  }
}
