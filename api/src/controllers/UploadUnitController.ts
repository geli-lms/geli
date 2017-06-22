import {Body, Post, JsonController, UseBefore, UploadedFile, BadRequestError} from 'routing-controllers';
import fs = require('fs');
import passportJwtMiddleware from '../security/passportJwtMiddleware';

import {VideoUnit} from '../models/units/VideoUnit';
import {UnitController} from './UnitController';

const uploadOptions = {dest: 'uploads/'};

@JsonController('/units/upload')
@UseBefore(passportJwtMiddleware)
export class UploadUnitController extends UnitController {

  @Post('/')
  addVideoUnit(@UploadedFile('file', {uploadOptions}) file: any, @Body() data: any) {
    // discard invalid requests
    if (!data.lectureId) {
      throw new BadRequestError('Misssing lectureId');
    }
    if (!data.name) {
      throw new BadRequestError('Misssing name');
    }

    // path for file upload units (for now video only)
    if (file) {
      return new VideoUnit({
        name: data.name,
        description: data.description,
        _course: data.courseId,
        filePath: file.path,
        fileName: file.originalname
      })
        .save()
        .then((unit) => this.pushToLecture(data.lectureId, unit));
    }
  }
}
