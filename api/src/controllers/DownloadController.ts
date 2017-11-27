const fs = require('fs');
const archiver = require('archiver');
import crypto = require('crypto');

import {Request} from 'express';
import {Body, Get, Post, Put, Param, Req, JsonController, UseBefore, Delete, NotFoundError} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';

import {CodeKataUnit} from '../models/units/CodeKataUnit';
import {Unit} from '../models/units/Unit';
import {IDownload} from '../../../shared/models/IDownload';
import {IFreeTextUnit} from '../../../shared/models/units/IFreeTextUnit';
import {FreeTextUnit} from '../models/units/FreeTextUnit';
import {TaskUnit} from '../models/units/TaskUnit';
import {ITaskUnit} from '../../../shared/models/units/ITaskUnit';
import {ICodeKataUnit} from '../../../shared/models/units/ICodeKataUnit';
import {IFileUnit} from '../../../shared/models/units/IFileUnit';
import {FileUnit} from '../models/units/FileUnit';
import {VideoUnit} from '../models/units/VideoUnit';
import {IVideoUnit} from '../../../shared/models/units/IVideoUnit';
import {Task} from '../models/Task';

@JsonController('/download')
@UseBefore(passportJwtMiddleware)
export class DownloadController {

  @Post('/')
  async addTask(@Body() data: IDownload) {

    const fileName = await crypto.pseudoRandomBytes(16);

    const output = fs.createWriteStream(__dirname + '/' + fileName.toString('hex') + '.zip');
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
        archive.append(codeKataUnit.description + '\n' + codeKataUnit.definition + '\n' + codeKataUnit.code, {name: codeKataUnit.name + '.txt'});
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
        let fileStream = '';

        for (const task of taskUnit.tasks) {
          const newTask = await Task.findOne(task._id);
            fileStream = fileStream + newTask.name + '\n';

          for(const answer of newTask.answers) {
              fileStream = fileStream + answer.text + ': [ ]\n';
            }
            fileStream = fileStream + '-------------------------------------\n';
            archive.append(taskUnit.description + '\n' + fileStream, {name: taskUnit.name + '.txt'});
        }
      } else {
        throw new NotFoundError();
      }
    }

    archive.finalize();


    return fileName.toString('hex') + '.zip';
  }

}
