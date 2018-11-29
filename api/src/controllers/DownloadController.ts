import {promisify} from 'util';
import {Response} from 'express';
import {
  NotFoundError, ForbiddenError, ContentType, UseBefore, Param, Res, Controller,
  Body, Post, Get, Delete, CurrentUser, Authorized
} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {Unit} from '../models/units/Unit';
import {IDownload} from '../../../shared/models/IDownload';
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
const pdf =  require('html-pdf');
const phantomjs = require('phantomjs-prebuilt');
const binPath = phantomjs.path;
import sassLoader from '../services/SassLoader';

// ATTENTION: relative path from compiled .js file!
const md_css = sassLoader.load('../../../../../shared/styles/md/bundle.scss');

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
        fs.unlink(config.tmpFileCacheFolder + record.key + '.zip', (err: Error) => {
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
    data += pack.courseName;
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
   * @api {post} /api/download/pdf/individual Post download request individual PDF
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
  @Post('/pdf/individual')
  @ContentType('application/json')
  async postDownloadRequestPDFIndividual(@Body() data: IDownload, @CurrentUser() user: IUser) {

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

            // create hashed pdf file
            const tempPdfFileName = this.tempPdfFileName(user);

            if (!localUnit) {
              throw new NotFoundError();
            }

            if (localUnit.__t === 'file') {
              for (const fileId of unit.files) {
                const file = await File.findById(fileId);
                archive.file( 'uploads/' + file.link, {name: lecCounter + '_' + lcName + '/' + unitCounter + '_' + file.name});
              }
            } else {

              const options = {
                phantomPath: binPath,
                format: 'A4',
                'border': {
                  'left': '1cm',
                  'right': '1cm'
                },
                'footer': {
                  'contents': {
                    default: '<div id="pageFooter">{{page}}/{{pages}}</div>'
                  }
                }
              };

              let html = '<!DOCTYPE html>\n' +
                '<html>\n' +
                '  <head>' +
                '     <style>' +
                '       #pageHeader {text-align: center;border-bottom: 1px solid;padding-bottom: 5px;}' +
                '       #pageFooter {text-align: center;border-top: 1px solid;padding-top: 5px;}' +
                '       html,body {font-family: \'Helvetica\', \'Arial\', sans-serif; font-size: 12px; line-height: 1.5;}' +
                '       .codeBox {border: 1px solid grey; font-family: Monaco,Menlo,source-code-pro,monospace; padding: 10px}' +
                '       #firstPage {page-break-after: always;}' +
                '       .bottomBoxWrapper {height:800px; position: relative}' +
                '       .bottomBox {position: absolute; bottom: 0;}' + md_css +
                '     </style>' +
                '  </head>';
                html += await localUnit.toHtmlForIndividualPDF();
                html += '</html>';
              const name = lecCounter + '_' + lcName + '/' + unitCounter + '_' + this.replaceCharInFilename(localUnit.name) + '.pdf';
              await this.savePdfToFile(html, options, tempPdfFileName);
              await this.appendToArchive(archive, name, tempPdfFileName, hash);
              fs.unlinkSync(tempPdfFileName);
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

  /**
   * @api {post} /api/download/pdf/single Post download request single PDF
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
  @Post('/pdf/single')
  @ContentType('application/json')
  async postDownloadRequestPDFSingle(@Body() data: IDownload, @CurrentUser() user: IUser) {
    // create hashed pdf file
    const tempPdfFileName = this.tempPdfFileName(user);

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

      data.courseName += 'Single';
      const hash = await this.createFileHash(data);
      const key = cache.get(hash);

      if (key === null) {
        const filepath = config.tmpFileCacheFolder + hash + '.zip';
        const output = fs.createWriteStream(filepath);
        const archive = archiver('zip', {
          zlib: {level: 9}
        });

        archive.pipe(output);

        const options = {
          phantomPath: binPath,
          format: 'A4',
          'border': {
            'left': '1cm',
            'right': '1cm',
            'top': '0',
            'bottom': '0'
          },
          'footer': {
            'contents': {
              default: '<div id="pageFooter">{{page}}/{{pages}}</div>'
            }
          },
          'header': {
            'contents': {
              default: '<div id="pageHeader">' + course.name + '</div>'
            },
            height: '20mm'
          }
        };

        let html = '<!DOCTYPE html>\n' +
          '<html>\n' +
          '  <head>' +
          '     <style>' +
          '       #pageHeader {text-align: center;border-bottom: 1px solid;padding-bottom: 5px;}' +
          '       #pageFooter {text-align: center;border-top: 1px solid;padding-top: 5px;}' +
          '       html, body {font-family: \'Helvetica\', \'Arial\', sans-serif; font-size: 12px; line-height: 1.5;}' +
          '       .codeBox {border: 1px solid grey; font-family: Monaco,Menlo,source-code-pro,monospace; padding: 10px}' +
          '       #firstPage {page-break-after: always;}' +
          '       #nextPage {page-break-before: always;}' +
          '       .bottomBoxWrapper {height:800px; position: relative}' +
          '       .bottomBox {position: absolute; bottom: 0;}' + md_css +
          '     </style>' +
          '  </head>' +
          '  <body>' +
          '  ';

        let solutions = '<div id="nextPage"><h2><u>Solutions</u></h2>';

        let lecCounter = 1;
        let firstSol = false;
        for (const lec of data.lectures) {

          const localLecture = await Lecture.findOne({_id: lec.lectureId});
          const lcName = this.replaceCharInFilename(localLecture.name);
          let unitCounter = 1;
          let solCounter = 1;
          if (lecCounter > 1) {
            html += '<div id="nextPage" ><h2>Lecture: ' + localLecture.name + '</h2>';
          } else {
            html += '<div><h2>Lecture: ' + localLecture.name + '</h2>';
          }

          for (const unit of lec.units) {
            const localUnit = await Unit.findOne({_id: unit.unitId});

            if (!localUnit) {
              throw new NotFoundError();
            }

            if (localUnit.__t === 'file') {
              for (const fileId of unit.files) {
                const file = await File.findById(fileId);
                archive.file(path.join(config.uploadFolder, file.link),
                  {name: lecCounter + '_' + lcName + '/' + unitCounter + '_' + file.name});
              }
            } else if ( (localUnit.__t === 'code-kata' || localUnit.__t === 'task') && lecCounter > 1 && unitCounter > 1) {
              html +=  '<div id="nextPage" >' + await localUnit.toHtmlForSinglePDF() + '</div>';
            } else {
              html +=  await localUnit.toHtmlForSinglePDF();
            }

            if (localUnit.__t === 'code-kata' || localUnit.__t === 'task') {

              if (!firstSol && solCounter === 1) {
                solutions += '<div><h2>Lecture: ' + localLecture.name + '</h2>';
                firstSol = true;
              } else if (solCounter === 1) {
                solutions += '<div id="nextPage" ><h2>Lecture: ' + localLecture.name + '</h2>';
              } else {
                solutions += '<div id="nextPage" >';
              }
              solutions += await localUnit.toHtmlForSinglePDFSolutions()  + '</div>';
              solCounter++;
            } else if (localUnit.__t !== 'file') {
              solutions += await localUnit.toHtmlForSinglePDFSolutions();
            }
            unitCounter++;
          }
          html += '</div>';
          lecCounter++;
        }
        html += solutions;
        html += '</div></body>' +
          '</html>';
        const name = this.replaceCharInFilename(course.name) + '.pdf';
        await this.savePdfToFile(html, options, tempPdfFileName);
        await this.appendToArchive(archive, name, tempPdfFileName, hash);
        fs.unlinkSync(tempPdfFileName);
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

  private tempPdfFileName(user: IUser) {
    return config.tmpFileCacheFolder +
      crypto.createHash('sha1').update(new Date() + user._id).digest('hex').toString().slice(0, 16) +
      '_temp.pdf';
  }

  private savePdfToFile(html: any, options: any, pathToFile: String ): Promise<void> {
    return new Promise<void>((resolve, reject) => {

      pdf.create(html, options).toFile(pathToFile, function(err: any, res: any) {
        if (err) { reject(err); }
        resolve();
      });

    });
  }

  private appendToArchive(archive: any, name: String, pathToFile: String, hash: any) {
    return new Promise<void>((resolve, reject) => {
      archive.on('entry', () => {
        resolve(); });
      archive.on('error', () => reject(hash));
      archive.file(pathToFile,
        {name: name});
    });
    }

  /**
   * @api {delete} /api/download/ Request to clean up the cache.
   * @apiName DeleteCache
   * @apiGroup Download
   * @apiPermission admin
   *
   * @apiSuccess {Object} result Empty object.
   *
   * @apiSuccessExample {json} Success-Response:
   *      {}
   */
  @Delete('/cache')
  @Authorized(['admin'])
  deleteCache() {
    this.cleanupCache();
    return {};
  }
}
