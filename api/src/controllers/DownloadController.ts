import {IFreeTextUnit} from '../../../shared/models/units/IFreeTextUnit';

var fs = require('fs');
var archiver = require('archiver');

import {Request} from 'express';
import {Body, Get, Post, Put, Param, Req, JsonController, UseBefore, Delete, NotFoundError} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';

import {Unit} from '../models/units/Unit';
import {IDownload} from '../../../shared/models/IDownload';
import {Course} from '../models/Course';
import {Lecture} from '../models/Lecture';
import {IUnit} from "../../../shared/models/units/IUnit";

@JsonController('/download')
// @UseBefore(passportJwtMiddleware)
export class DownloadController {

  @Post('/')
  async addTask(@Body() data: IDownload) {

    let units = [];
    for (const unit of data.units) {
      const localUnit = await Unit.findOne({_id: unit});
      units.push(localUnit);
    }

    var output = fs.createWriteStream(__dirname + '/' + data.course + '.zip');
    var archive = archiver('zip', {
      zlib: {level: 9} // Sets the compression level.
    });

// pipe archive data to the file
    archive.pipe(output);

    for (const printUnit of units) {
      archive.append(printUnit.description + '\n', {name: printUnit.name + '.txt'});
    }

    archive.finalize();


    return true;
  }

}
