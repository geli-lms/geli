const fs = require('fs');
const archiver = require('archiver');

import {Request} from 'express';
import {Body, Get, Post, Put, Param, Req, JsonController, UseBefore, Delete, NotFoundError} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';

import {CodeKataUnit} from '../models/units/CodeKataUnit';
import {Unit} from '../models/units/Unit';
import {IDownload} from '../../../shared/models/IDownload';
import {Lecture} from '../models/Lecture';
import {IUnit} from '../../../shared/models/units/IUnit';
import {ITask} from '../../../shared/models/task/ITask';
import {IFreeTextUnit} from '../../../shared/models/units/IFreeTextUnit';
import {IVideoUnitModel, VideoUnit} from '../models/units/VideoUnit';
import {FreeTextUnit} from '../models/units/FreeTextUnit';
import {IFileUnitModel, FileUnit} from '../models/units/FileUnit';
import {TaskUnit} from '../models/units/TaskUnit';
import {ICodeKataUnit} from '../../../shared/models/units/ICodeKataUnit';
import {IFileUnit} from '../../../shared/models/units/IFileUnit';
import {IVideoUnit} from '../../../shared/models/units/IVideoUnit';
import {ITaskUnit} from '../../../shared/models/units/ITaskUnit';

@JsonController('/download')
// @UseBefore(passportJwtMiddleware)
export class DownloadController {

  @Post('/')
  async addTask(@Body() data: IDownload) {

    const output = fs.createWriteStream(__dirname + '/' + data.course + '.zip');
    const archive = archiver('zip', {
      zlib: {level: 9} // Sets the compression level.
    });

    archive.pipe(output);

    for (const unit of data.units) {
      const localUnit = await Unit.findOne({_id: unit});
      if (localUnit instanceof FreeTextUnit) {
        const freeTextUnit = <IFreeTextUnit><any>localUnit;
        archive.append(freeTextUnit.description + '\n' + freeTextUnit.markdown, {name: freeTextUnit.name + '.txt'});
      } else if (localUnit instanceof CodeKataUnit) {
        const codeKataUnit = <ICodeKataUnit><any>localUnit;
        archive.append(codeKataUnit.description + '\n' + codeKataUnit.code, {name: codeKataUnit.name + '.txt'});
      } else if (localUnit instanceof FileUnit) {
        const fileUnit = <IFileUnit><any>localUnit;
        for (const file of fileUnit.files) {
          archive.file(file.path, {name: file.name});
        }
      } else if (localUnit instanceof VideoUnit) {
        const videoFileUnit = <IVideoUnit><any>localUnit;
        for (const file of videoFileUnit.files) {
          archive.file(file.path, {name: file.name});
        }
      } else if (localUnit instanceof TaskUnit) {
        const taskUnit = <ITaskUnit><any>localUnit;
        let fileStream: string = '';

        for (const task of taskUnit.tasks) {
          fileStream.concat(task.name + '\n' + task.answers);
        }
        archive.append(taskUnit.description + '\n' + fileStream, {name: taskUnit.name + '.txt'});
      } else {
        throw new NotFoundError();
      }
    }

    archive.finalize();


    return __dirname + '/' + data.course + '.zip';
  }

}
