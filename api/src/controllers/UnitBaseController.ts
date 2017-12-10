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

    if (file) {
      data.model = this.handleUploadedFile(file, data.model);
    }

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

  @Authorized(['teacher', 'admin'])
  @Put('/:id')
  async updateUnit(@UploadedFile('file', {options: uploadOptions}) file: any, @Param('id') id: string, @Body() data: any) {
    const oldUnit: IUnitModel = await Unit.findById(id);

    if (!oldUnit) {
      throw new NotFoundError();
    }

    if (file) {
      data = JSON.parse(data.data);
      data = this.handleUploadedFile(file, data.model, oldUnit);
    }

    const updatedUnit: IUnitModel = await Unit.findOneAndUpdate({'_id': id}, data, {new: true});
    return updatedUnit.toObject();
  }

  @Authorized(['teacher', 'admin'])
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

  private handleUploadedFile(file: any, unit: IFileUnit, oldUnit?: IUnitModel) {
    if (!unit.hasOwnProperty('files')) {
      unit.files = []
    }

    if (oldUnit) {
      (<IFileUnitModel>oldUnit).files.forEach((oldUnitFile: any) => {
        // if not present in new: delete
        if (!unit.files.some((newFile) => newFile._id === oldUnitFile._id)) {
          fs.unlink(oldUnitFile.path, () => {}); // silently discard file not found errors
        }
      });
    }

    unit.files.push({path: file.path, name: file.filename, alias: file.originalname, size: file.size});
    return unit;
  }
}
