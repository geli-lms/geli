import {promisify} from 'util';

const fs = require('fs');
const archiver = require('archiver');
import crypto = require('crypto');

const appRoot = require('app-root-path');
import {Response} from 'express';
import {
  Body, Post, Get, Header, NotFoundError, ContentType, UseInterceptor, OnUndefined, UseBefore, Param, Res, Controller,
  Action
} from 'routing-controllers';
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

@Controller('/download')
@UseBefore(passportJwtMiddleware)
export class DownloadController {

  @Get('/:id')
  async getArchivedFile(@Param('id') id: string, @Res() response: Response) {
    const filePath = appRoot + '/temp/' + id + '.zip';

    await promisify<string, void>(response.download.bind(response))(filePath);
    return response;

  }

  @Get('/size/')
  async getFileSize(@Body() data: IDownload) {

    let totalSize: number = 0;
    let tooLargeFiles: Array<string> = [];


    for (const lec of data.lectures) {
      for (const unit of lec.units) {

        const localUnit = await Unit.findOne({_id: unit.unitId});
        if (localUnit instanceof FileUnit) {
          const fileUnit = <IFileUnit><any>localUnit;
          fileUnit.files.forEach((file, index) => {
            if (unit.files.indexOf({id: index})) {
              const stats = fs.statSync(file.path);
              const fileSize = stats.size / 1000000.0;
              if( fileSize > 50 ) {
                tooLargeFiles.push(file.path);
              }
              totalSize += fileSize;
            }
          });
        } else if (localUnit instanceof VideoUnit) {
          const videoFileUnit = <IVideoUnit><any>localUnit;
          videoFileUnit.files.forEach((file, index) => {
            if (unit.files.indexOf({id: index}) !== -1) {
              const stats = fs.statSync(file.path);
              const fileSize = stats.size / 1000000.0;
              if( fileSize > 50 ) {
                tooLargeFiles.push(file.path);
              }
              totalSize += fileSize;
            }
          });
        }
      }
    }

    let downPackage = {size: totalSize, largeElements: tooLargeFiles};

    return downPackage;
  }

  @Post('/')
  @ContentType('application/json')
  async postDownloadRequest(@Body() data: IDownload) {

    if (data.lectures.length === 0) {
      throw new NotFoundError();
    }

    const fileName = await crypto.pseudoRandomBytes(16).toString('hex');
    const filepath = appRoot + '/temp/' + fileName + '.zip';
    const output = fs.createWriteStream(filepath);
    const archive = archiver('zip', {
      zlib: {level: 9} // Sets the compression level.
    });

    archive.on('error', function (err: Error) {
      throw err;
    });

    archive.pipe(output);

    for (const lec of data.lectures) {
      for (const unit of lec.units) {

        const localUnit = await Unit.findOne({_id: unit.unitId});
        if (localUnit instanceof FreeTextUnit) {
          const freeTextUnit = <IFreeTextUnit><any>localUnit;
          archive.append(freeTextUnit.description + '\n' + freeTextUnit.markdown, {name: freeTextUnit.name + '.txt'});
        } else if (localUnit instanceof CodeKataUnit) {
          const codeKataUnit = <ICodeKataUnit><any>localUnit;
          archive.append(codeKataUnit.description + '\n' + codeKataUnit.definition + '\n' +
            codeKataUnit.code, {name: codeKataUnit.name + '.txt'});
        } else if (localUnit instanceof FileUnit) {
          const fileUnit = <IFileUnit><any>localUnit;
          fileUnit.files.forEach((file, index) => {
            if (unit.files.indexOf({id: index})) {
              archive.file(file.path, {name: file.name});
            }
          });
        } else if (localUnit instanceof VideoUnit) {
          const videoFileUnit = <IVideoUnit><any>localUnit;
          videoFileUnit.files.forEach((file, index) => {
            if (unit.files.indexOf({id: index}) !== -1) {
              archive.file(file.path, {name: file.name});
            }
          });
        } else if (localUnit instanceof TaskUnit) {
          const taskUnit = <ITaskUnit><any>localUnit;
          let fileStream = '';

          for (const task of taskUnit.tasks) {
            const newTask = await Task.findOne(task._id);
            fileStream = fileStream + newTask.name + '\n';

            for (const answer of newTask.answers) {
              fileStream = fileStream + answer.text + ': [ ]\n';
            }
            fileStream = fileStream + '-------------------------------------\n';
            archive.append(taskUnit.description + '\n' + fileStream, {name: taskUnit.name + '.txt'});
          }
        } else {
          throw new NotFoundError();
        }
      }
    }

    archive.finalize();

    return fileName;
  }

}
