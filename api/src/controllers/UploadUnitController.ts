import {Body, Put, Post, Delete, Param, JsonController, UseBefore, UploadedFile} from 'routing-controllers';
import fs = require('fs');
import passportJwtMiddleware from '../security/passportJwtMiddleware';

import {Lecture} from '../models/Lecture';
import {Unit} from '../models/units/Unit';
import {IUnit} from '../../../shared/models/units/IUnit';
import {VideoUnit} from '../models/units/VideoUnit';
import {UnitController} from './UnitController';

const uploadOptions = {dest: 'uploads/' };

@JsonController('/unit/upload')
@UseBefore(passportJwtMiddleware)
export class UploadUnitController extends UnitController {

  @Post('/')
  addVideoUnit(@UploadedFile('file', { uploadOptions }) file: any, @Body() data: any) {
    // discard invalid requests
    if (!data.lectureId) {
      return;
    }
    // path for file upload units (for now video only)
    if (file) {
      return new VideoUnit({filePath: file.path, fileName: file.originalname}).save()
      .then((unit) => this.pushToLecture(data.lectureId, unit));
    }
  }

  @Put('/:id')
  updateUnit(@Param('id') id: string, @Body() unit: IUnit) {
    return Unit.findByIdAndUpdate(id, unit, {'new': true})
    .then((u) => u.toObject());
  }

  @Delete('/:id')
  deleteUnit(@Param('id') id: string) {
    return VideoUnit.findById(id).then((unit) => {
      if (!unit) {
        throw new Error('No unit found for id');
      }
      /*
      if (unit.filePath) {
        fs.unlinkSync(unit.filePath);
      }*/
      return Lecture.update({}, {$pull: {units: id}});
    })
    .then(() => Unit.findByIdAndRemove(id))
    .then(() => {
      return {result: true};
    });
  }
}
