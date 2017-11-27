import {Request} from 'express';
import {Body, Get, Post, Put, Param, Req, JsonController, UseBefore, Delete, NotFoundError} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';

import {Unit} from '../models/units/Unit';
import {IDownload} from '../../../shared/models/IDownload';
import {Course} from '../models/Course';
import {Lecture} from '../models/Lecture';

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


    return true;
  }

}
