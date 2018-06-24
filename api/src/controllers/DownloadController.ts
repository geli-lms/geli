import {promisify} from 'util';
import {Response} from 'express';
import {
  Body, Post, Get, NotFoundError, ForbiddenError, ContentType, UseBefore, Param, Res, Controller,
  CurrentUser
} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {Unit, FreeTextUnit, CodeKataUnit, TaskUnit} from '../models/units/Unit';
import {IDownload} from '../../../shared/models/IDownload';
import {IFreeTextUnit} from '../../../shared/models/units/IFreeTextUnit';
import {ITaskUnit} from '../../../shared/models/units/ITaskUnit';
import {ICodeKataUnit} from '../../../shared/models/units/ICodeKataUnit';
import {IFileUnit} from '../../../shared/models/units/IFileUnit';
import {Lecture} from '../models/Lecture';
import {IUser} from '../../../shared/models/IUser';
import {Course} from '../models/Course';
import config from '../config/main';
import {errorCodes} from '../config/errorCodes';

import * as fs from 'fs';
import * as path from 'path';
const archiver = require('archiver');
import crypto = require('crypto');
import {User} from '../models/User';
import {File} from '../models/mediaManager/File';

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

        if (localUnit.__t === 'file') {
          const fileUnit = <IFileUnit><any>localUnit;
          fileUnit.files.forEach((file, index) => {
            if (unit.files.indexOf(index) > -1) {
              if ((file.size / 1024 ) > config.maxFileSize) {
                localTooLargeFiles.push(file.link);
              }
              localTotalSize += (file.size / 1024 );
            }
          });
        }
      }
    }
    const size = {totalSize: localTotalSize, tooLargeFiles: localTooLargeFiles};
    return size;
  }

  /**
   * @api {get} /api/download/:id Request archived file
   * @apiName GetDownload
   * @apiGroup Download
   *
   * @apiParam {String} id Course name.
   * @apiParam {Response} response Response (input).
   *
   * @apiSuccess {Response} response Response (output).
   *
   * @apiSuccessExample {json} Success-Response:
   *     UEsFBgAAAAAAAAAAAAAAAAAAAAAAAA==
   *
   * @apiError NotFoundError File could not be found.
   * @apiError ForbiddenError Invalid id i.e. filename (e.g. '../something').
   */
  @Get('/:id')
  async getArchivedFile(@Param('id') id: string, @Res() response: Response) {
    const tmpFileCacheFolder = path.resolve(config.tmpFileCacheFolder);
    const filePath = path.join(tmpFileCacheFolder, id + '.zip');

    // Assures that the filePath actually points to a file within the tmpFileCacheFolder.
    // This is because the id parameter could be something like '../forbiddenFile' ('../' via %2E%2E%2F in the URL).
    if (path.dirname(filePath) !== tmpFileCacheFolder) {
      throw new ForbiddenError(errorCodes.file.forbiddenPath.code);
    }

    if (!fs.existsSync(filePath)) {
      throw new NotFoundError();
    }

    response.setHeader('Connection', 'keep-alive');
    response.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    await promisify<string, void>(response.download.bind(response))(filePath);
    return response;
  }

  async createFileHash(pack: IDownload) {
    let data = '';

    for (const lec of pack.lectures) {
      for (const unit of lec.units) {

        const localUnit = await
          Unit.findOne({_id: unit.unitId});
        if (localUnit.__t === 'file') {
          const fileUnit = <IFileUnit><any>localUnit;
          fileUnit.files.forEach((file, index) => {
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

  /**
   * @api {post} /api/download/ Post download request
   * @apiName PostDownload
   * @apiGroup Download
   *
   * @apiParam {IDownload} data Course data.
   * @apiParam {IUser} currentUser Currently logged in user.
   *
   * @apiSuccess {String} hash Hash value.
   *
   * @apiSuccessExample {json} Success-Response:
   *     "da39a3ee5e6b4b0d3255bfef95601890afd80709"
   *
   * @apiError NotFoundError
   */
  @Post('/')
  @ContentType('application/json')
  async postDownloadRequest(@Body() data: IDownload, @CurrentUser() user: IUser) {

    const course = await Course.findOne({_id: data.courseName});

    if (course === null) {
      throw new NotFoundError();
    }

    const courseAdmin = await User.findOne({_id: course.courseAdmin});

    if (course.students.indexOf(user._id) !== -1 || courseAdmin.equals(user._id.toString()) ||
      course.teachers.indexOf(user._id) !== -1 || user.role === 'admin') {

      if (!data.lectures.length) {
        throw new NotFoundError();
      }

      const size = await this.calcPackage(data);

      if (size.totalSize > config.maxZipSize || size.tooLargeFiles.length !== 0) {
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

          if (!localUnit) {
              throw new NotFoundError();
            }

            if (localUnit.__t === 'file') {
              for (const fileId of unit.files) {
                const file = await File.findById(fileId);
                archive.file( 'uploads/' + file.link, {name: lecCounter + '_' + lcName + '/' + unitCounter + '_' + file.name});
              }
            } else {
              archive.append(localUnit.toFile(),
                {name: lecCounter + '_' + lcName + '/' + unitCounter + '_' + this.replaceCharInFilename(localUnit.name) + '.txt'});
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
