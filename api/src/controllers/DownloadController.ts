import {promisify} from 'util';
import {Response} from 'express';
import {
  Body, Post, Get, NotFoundError, ContentType, UseBefore, Param, Res, Controller,
  CurrentUser
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
import {Lecture} from '../models/Lecture';
import {IUser} from '../../../shared/models/IUser';
import {Course} from '../models/Course';
import config from '../config/main';

const fs = require('fs');
const archiver = require('archiver');
import crypto = require('crypto');

const cache = require('node-file-cache').create({life: config.timeToLiveCacheValue});

// Set all routes which should use json to json, the standard is blob streaming data
@Controller('/download')
@UseBefore(passportJwtMiddleware)
export class DownloadController {

  constructor() {
    setInterval(this.cleanupCache, config.timeToLiveCacheValue * 60);
  }

  cleanupCache() {
    cache.expire((record: any) => {
      return new Promise((resolve, reject) => {
        fs.unlink( config.tmpFileCacheFolder + record.key + '.zip', (err: Error) => {
          if (err) {
            reject(false);
          } else {
            resolve(true);
          }
        });
      });
    });
  }

  replaceCharInFilename(filename: string) {
    return filename.replace(/[^a-zA-Z0-9 -]/g, '')    // remove special characters
      .replace(/ /g, '-')             // replace space by dashes
      .replace(/-+/g, '-');
  }

  async calcPackage(pack: IDownload) {

    let localTotalSize = 0;
    const localTooLargeFiles: Array<String> = [];

    for (const lec of pack.lectures) {
      for (const unit of lec.units) {

        const localUnit = await Unit.findOne({_id: unit.unitId});

        if (localUnit === null) {
          throw new NotFoundError();
        }

        // This should be replaced with the size from the DB
        if (localUnit instanceof FileUnit) {
          const fileUnit = <IFileUnit><any>localUnit;
          fileUnit.files.forEach((file, index) => {
            if (unit.files.indexOf(index) > -1) {
              const stats = fs.statSync(file.path);
              const fileSize = stats.size / 1000000.0;
              if (fileSize > 50) {
                localTooLargeFiles.push(file.path);
              }
              localTotalSize += fileSize;
            }
          });
        } else if (localUnit instanceof VideoUnit) {
          const videoFileUnit = <IVideoUnit><any>localUnit;
          videoFileUnit.files.forEach((file, index) => {
            if (unit.files.indexOf(index) > -1) {
              const stats = fs.statSync(file.path);
              const fileSize = stats.size / 1000000.0;
              if (fileSize > 50) {
                localTooLargeFiles.push(file.path);
              }
              localTotalSize += fileSize;
            }
          });
        }
      }
    }
    const size = {totalSize: localTotalSize, tooLargeFiles: localTooLargeFiles};
    return size;
  }

  @Get('/:id')
  async getArchivedFile(@Param('id') id: string, @Res() response: Response) {
    const filePath = config.tmpFileCacheFolder + id + '.zip';

    if (!fs.existsSync(filePath)) {
      throw new NotFoundError();
    }

    response.setHeader('Connection', 'keep-alive');
    response.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    await promisify<string, void>(response.download.bind(response))(filePath);
    return response;
  }

  @Post('/size/')
  @ContentType('application/json')
  async getFileSize(@Body() data: any) {
    return this.calcPackage(data);
  }

  async createFileHash(pack: IDownload) {
    let data = '';

    for (const lec of pack.lectures) {
      for (const unit of lec.units) {

        const localUnit = await
          Unit.findOne({_id: unit.unitId});
        if (localUnit instanceof FileUnit) {
          const fileUnit = <IFileUnit><any>localUnit;
          fileUnit.files.forEach((file, index) => {
            if (unit.files.indexOf(index) > -1) {
              data = data + file.name;
            }
          });
        } else if (localUnit instanceof VideoUnit) {
          const videoFileUnit = <IVideoUnit><any>localUnit;
          videoFileUnit.files.forEach((file, index) => {
            if (unit.files.indexOf(index) > -1) {
              data = data + file.name;
            }
          });
        } else {
          data = data + localUnit._id;
        }
      }
    }

    return crypto.createHash('sha1').update(data).digest('hex');
  }

  @Post('/')
  @ContentType('application/json')
  async postDownloadRequest(@Body() data: IDownload, @CurrentUser() user: IUser) {

    const course = await Course.findOne({_id: data.courseName});

    if (course === null) {
      throw new NotFoundError();
    }

    if (course.students.indexOf(user._id) !== -1 || course.courseAdmin === user._id ||
      course.teachers.indexOf(user._id) !== -1 || user.role === 'admin') {

      if (!data.lectures.length) {
        throw new NotFoundError();
      }

      const size = await this.calcPackage(data);

      if (size.totalSize > 200 || size.tooLargeFiles.length !== 0) {
        throw new NotFoundError();
      }

      const hash = await this.createFileHash(data);
      const key = cache.get(hash);

      if (key === null) {
        const filepath = config.tmpFileCacheFolder + hash + '.zip';
        const output = fs.createWriteStream(filepath);
        const archive = archiver('zip', {
          zlib: {level: 9}
        });

        archive.pipe(output);

        let lecCounter = 1;
        for (const lec of data.lectures) {

          const localLecture = await Lecture.findOne({_id: lec.lectureId});
          const lcName = this.replaceCharInFilename(localLecture.name);
          let unitCounter = 1;

          for (const unit of lec.units) {

            const localUnit = await Unit.findOne({_id: unit.unitId});
            if (localUnit instanceof FreeTextUnit) {
              const freeTextUnit = <IFreeTextUnit><any>localUnit;
              archive.append(FreeTextUnit.schema.statics.toFile(freeTextUnit), {
                name: lecCounter + '_' + lcName + '/' + unitCounter + '_' + this.replaceCharInFilename(freeTextUnit.name) + '.md'
              });
            } else if (localUnit instanceof CodeKataUnit) {
              const codeKataUnit = <ICodeKataUnit><any>localUnit;
              archive.append(CodeKataUnit.schema.statics.toFile(codeKataUnit),
                {name: lecCounter + '_' + lcName + '/' + unitCounter + '_' + this.replaceCharInFilename(codeKataUnit.name) + '.txt'});
            } else if (localUnit instanceof FileUnit) {
              const fileUnit = <IFileUnit><any>localUnit;
              fileUnit.files.forEach((file, index) => {
                if (unit.files.indexOf(index) > -1) {
                  archive.file(file.path, {name: lecCounter + '_' + lcName + '/' + unitCounter + '_' + file.alias});
                }
              });
            } else if (localUnit instanceof VideoUnit) {
              const videoFileUnit = <IVideoUnit><any>localUnit;
              videoFileUnit.files.forEach((file, index) => {
                if (unit.files.indexOf(index) > -1) {
                  archive.file(file.path, {name: lecCounter + '_' + lcName + '/' + unitCounter + '_' + file.alias});
                }
              });
            } else if (localUnit instanceof TaskUnit) {
              const taskUnit = <ITaskUnit><any>localUnit;
              archive.append(await Task.schema.statics.toFile(taskUnit),
                {name: lecCounter + '_' + lcName + '/' + unitCounter + '. ' + this.replaceCharInFilename(taskUnit.name) + '.txt'});
            } else {
              throw new NotFoundError();
            }
            unitCounter++;
          }
          lecCounter++;
        }
        return new Promise((resolve, reject) => {
          archive.on('error', () => reject(hash));
          archive.finalize();
          cache.set(hash, hash);
          archive.on('end', () => resolve(hash));
        });
      } else {
        return hash;
      }
    } else {
      throw new NotFoundError();
    }
  }
}
