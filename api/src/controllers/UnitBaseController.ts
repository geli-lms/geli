import {
  Body, Get, Put, Delete, Param, JsonController, UseBefore, NotFoundError, BadRequestError, Post,
  Authorized, UploadedFile
} from 'routing-controllers';
import fs = require('fs');
import passportJwtMiddleware from '../security/passportJwtMiddleware';

import {Lecture} from '../models/Lecture';
import {Unit} from '../models/units/Unit';
import {IUnit} from '../../../shared/models/units/IUnit';
import {IVideoUnitModel, VideoUnit} from '../models/units/VideoUnit';
import {IFileUnitModel, FileUnit} from '../models/units/FileUnit';
import {TaskUnit} from '../models/units/TaskUnit';

const uploadOptions = {dest: 'uploads/'};

@JsonController('/units')
@UseBefore(passportJwtMiddleware)
export class UnitBaseController {

  @Get('/:id')
  getUnit(@Param('id') id: string) {
    return Unit.findById(id)
    .then((u) => u.toObject());
  }

  @Authorized(['teacher', 'admin'])
  @Post('/')
  addUnit(@Body() data: any) {
    // discard invalid requests
    this.checkPostParam(data);
    return Unit.create(data.model)
    .then((createdUnit) => {
      return this.pushToLecture(data.lectureId, createdUnit);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  @Put('/:id')
  updateUnit(@Param('id') id: string, @Body() unit: IUnit) {
    return Unit.findById(id).then((oldUnit) => {
      if (!oldUnit) {
        throw new NotFoundError();
      }
      // pre update: delete removed files
      if (oldUnit instanceof VideoUnit) {
        (<IVideoUnitModel>oldUnit).files.forEach((file: any) => {
          // if not present in new: delete
          if (!(<IVideoUnitModel>unit).files.some((newFile) => newFile.name === file.name)) {
            fs.unlink(file.path, () => {}); // silently discard file not found errors
          }
        });
        return VideoUnit;
      }
      if (oldUnit instanceof FileUnit) {
        (<IFileUnitModel>oldUnit).files.forEach((file: any) => {
          // if not present in new: delete
          if (!(<IFileUnitModel>unit).files.some((newFile) => newFile.name === file.name)) {
            fs.unlink(file.path, () => {}); // silently discard file not found errors
          }
        });
        return FileUnit;
      }
      if (oldUnit instanceof TaskUnit) {
        return TaskUnit;
      }
      return Unit;
    }).then((model) => model.findByIdAndUpdate(id, unit, {'new': true}))
      .then((u) => u.toObject());
  }

  @Delete('/:id')
  deleteUnit(@Param('id') id: string) {
    return Unit.findById(id).then((unit) => {
      if (!unit) {
        throw new NotFoundError();
      }

      return Lecture.update({}, {$pull: {units: id}})
        .then(() => unit.remove())
        .then(() => {
          return {result: true};
        });
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

  protected checkPostParam(data: any) {
    if (!data.lectureId) {
      throw new BadRequestError('No lecture ID was submitted.');
    }

    if (!data.model) {
      throw new BadRequestError('No unit was submitted.');
    }

    if (!data.model._course) {
      throw new BadRequestError('Unit has no _course set');
    }
  }
}
