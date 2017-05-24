import {Request} from 'express';
import {Body, Get, Put, Post, Delete, Param, Req, JsonController, UseBefore, UploadedFile} from 'routing-controllers';
import fs = require('fs');
import passportJwtMiddleware from '../security/passportJwtMiddleware';

import {Lecture} from '../models/Lecture';
import {Unit} from '../models/units/Unit';
import {IUnit} from '../../../shared/models/IUnit';

const uploadOptions = {dest: 'uploads/' };

@JsonController('/unit')
@UseBefore(passportJwtMiddleware)
export class UnitController {

  @Get('/:id')
  getUnit(@Param('id') id: string) {
    return Unit.findById(id)
      .then((u) => u.toObject());
  }

  @Post('/')
  addUnit(@UploadedFile('file', { uploadOptions }) file: any, @Body() data: any) {
    // discard invalid requests
    if (!data.lectureId) {
      return;
    }
    // path for file upload units (for now video only)
    if (file) {
      return new Unit({type: 'video', filePath: file.path, fileName: file.originalname}).save()
        .then((unit) => {
          return Lecture.findById(data.lectureId).then(lecture => ({lecture, unit}));
        })
        .then(({lecture, unit}) => {
          lecture.units.push(unit);
          return lecture.save();
        })
        .then(lecture => lecture.toObject());
    }
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
      if (unit.filePath) {
        fs.unlinkSync(unit.filePath);
      }
      return Lecture.update({}, {$pull: {units: id}});
    })
    .then(() => Unit.findByIdAndRemove(id))
    .then(() => {
      return {result: true};
    });
  }
}
