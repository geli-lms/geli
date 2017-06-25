import {Body, Post, JsonController, UseBefore, UploadedFile, BadRequestError, Authorized} from 'routing-controllers';
import fs = require('fs');
import crypto = require('crypto');
const multer = require('multer');
import passportJwtMiddleware from '../security/passportJwtMiddleware';

import {VideoUnit, IVideoUnitModel} from '../models/units/VideoUnit';
import {FileUnit, IFileUnitModel} from '../models/units/FileUnit';
import {UnitController} from './UnitController';

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

@JsonController('/units/upload')
@UseBefore(passportJwtMiddleware)
export class UploadUnitController extends UnitController {

  @Authorized(['teacher', 'admin'])
  @Post('/video')
  addVideoUnit(@UploadedFile('file', {uploadOptions}) file: any, @Body() data: any) {
    // discard invalid requests
    if (!data.lectureId) {
      fs.unlinkSync(file.path);
      throw new BadRequestError('Misssing lectureId');
    }
    if (!data.courseId) {
      fs.unlinkSync(file.path);
      throw new BadRequestError('Misssing courseId');
    }
    if (!data.name) {
      fs.unlinkSync(file.path);
      throw new BadRequestError('Misssing name');
    }

    if (file) {
      if (data.unitId) {
        // add to existing unit
        return VideoUnit.findById(data.unitId)
          .then((unit) => {
            (<IVideoUnitModel>unit).files.push({
              path: file.path,
              name: file.filename,
              alias: file.originalname,
            });
            return unit.save();
          })
          .then((unit) => unit.toObject());
      } else {
        // create new unit
        return new VideoUnit({
          name: data.name,
          description: data.description,
          _course: data.courseId,
          files: [{path: file.path, name: file.filename, alias: file.originalname}],
        })
          .save()
          .then((unit) => ({lecture: this.pushToLecture(data.lectureId, unit), unit}))
          .then(({lecture, unit}) => unit.toObject());
      }
    }
  }

  @Post('/file')
  addFileUnit(@UploadedFile('file', {uploadOptions}) file: any, @Body() data: any) {
    // discard invalid requests
    if (!data.lectureId) {
      fs.unlinkSync(file.path);
      throw new BadRequestError('Misssing lectureId');
    }
    if (!data.courseId) {
      fs.unlinkSync(file.path);
      throw new BadRequestError('Misssing courseId');
    }
    if (!data.name) {
      fs.unlinkSync(file.path);
      throw new BadRequestError('Misssing name');
    }

    if (file) {
      if (data.unitId) {
        // add to existing unit
        return FileUnit.findById(data.unitId)
          .then((unit) => {
            (<IFileUnitModel>unit).files.push({
              path: file.path,
              name: file.filename,
              alias: file.originalname,
            });
            return unit.save();
          })
          .then((unit) => unit.toObject());
      } else {
        // create new unit
        return new FileUnit({
          name: data.name,
          description: data.description,
          _course: data.courseId,
          files: [{path: file.path, name: file.filename, alias: file.originalname}],
        })
          .save()
          .then((unit) => ({lecture: this.pushToLecture(data.lectureId, unit), unit}))
          .then(({lecture, unit}) => unit.toObject());
      }
    }
  }
}
