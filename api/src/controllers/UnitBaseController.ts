import {
  Body, Get, Put, Delete, Param, JsonController, UseBefore, NotFoundError, BadRequestError, Post,
  Authorized, UploadedFile, Req
} from 'routing-controllers';
import fs = require('fs');
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import crypto = require('crypto');

import {ILectureModel, Lecture} from '../models/Lecture';
import {IUnitModel, Unit} from '../models/units/Unit';
import {IUnit} from '../../../shared/models/units/IUnit';
import {IVideoUnitModel, VideoUnit} from '../models/units/VideoUnit';
import {IFileUnitModel, FileUnit} from '../models/units/FileUnit';
import {TaskUnit} from '../models/units/TaskUnit';
import {IVideoUnit} from '../../../shared/models/units/IVideoUnit';
import {IFileUnit} from '../../../shared/models/units/IFileUnit';

const multer = require('multer');

const uploadOptions = {
  storage: multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      cb(null, 'uploads/');
    },
    filename: (req: any, file: any, cb: any) => {
      const extPos = file.originalname.lastIndexOf('.');
      const ext = (extPos !== -1) ? `.${file.originalname.substr(extPos + 1).toLowerCase()}` : '';
      crypto.pseudoRandomBytes(16, (err, raw) => {
        cb(err, err ? undefined : `${raw.toString('hex')}${ext}`);
      });
    }
  }),
};

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
  addUnit(@UploadedFile('file', {options: uploadOptions}) file: any, @Body() data: any) {
    if (file) {
      data = JSON.parse(data.data);
    }

    // discard invalid requests
    this.checkPostParam(data, file);
    data.model = this.handleUploadedFile(file, data.model);

    return Unit.create(data.model)
    .then((createdUnit) => {
      return this.pushToLecture(data.lectureId, createdUnit);
    })
    .catch((err) => {
      if (file) {
        fs.unlinkSync(file.path);
      }
      throw new BadRequestError(err);
    });
  }

  @Put('/:id')
  updateUnit(@UploadedFile('file', {options: uploadOptions}) file: any, @Param('id') id: string, @Body() unit: IUnit) {
    // TODO: Complete PUT Implementation
    return Unit.findById(id).then((oldUnit: IUnit) => {
      if (!oldUnit) {
        throw new NotFoundError();
      }
      // pre update: delete removed files
      /*
      if (oldUnit instanceof VideoUnit) {
        (<IVideoUnit>oldUnit).files.forEach((file: any) => {
          // if not present in new: delete
          if (!(<IVideoUnit>unit).files.some((newFile) => newFile.name === file.name)) {
            fs.unlink(file.path, () => {}); // silently discard file not found errors
          }
        });
        return VideoUnit;
      }
      if (oldUnit instanceof FileUnit) {
        (<IFileUnit>oldUnit).files.forEach((file: any) => {
          // if not present in new: delete
          if (!(<IFileUnit>unit).files.some((newFile) => newFile.name === file.name)) {
            fs.unlink(file.path, () => {}); // silently discard file not found errors
          }
        });
        return FileUnit;
      }
      */
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
      .then(() => {
        return unit.toObject();
      })
      .catch((err) => {
        throw new BadRequestError(err);
      });
  }

  protected checkPostParam(data: any, file?: any) {
    try {
      if (!data.lectureId) {
        throw new BadRequestError('No lecture ID was submitted.');
      }

      if (!data.model) {
        throw new BadRequestError('No unit was submitted.');
      }

      if (!data.model._course) {
        throw new BadRequestError('Unit has no _course set');
      }
    } catch (error) {
      if (file) {
        fs.unlinkSync(file.path);
      }
      throw error;
    }
  }

  private handleUploadedFile(file: any, unit: IFileUnit) {
    if (!unit.hasOwnProperty('files')) {
      unit.files = []
    }

    unit.files.push({path: file.path, name: file.filename, alias: file.originalname});
    return unit;
  }
}
