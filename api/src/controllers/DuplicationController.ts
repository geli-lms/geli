import {Request} from 'express';
import {Body, Get, Post, Put, Delete, Param, Req, JsonController, UseBefore, Authorized} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {FreeTextUnit} from '../models/units/FreeTextUnit';
import {TaskUnit} from '../models/units/TaskUnit';
import {CodeKataUnit} from '../models/units/CodeKataUnit';
import {FileUnit} from '../models/units/FileUnit';
import {VideoUnit} from '../models/units/VideoUnit';
import {IUnit} from '../../../shared/models/units/IUnit';
import {ITaskUnit} from '../../../shared/models/units/ITaskUnit';
import {ITask} from '../../../shared/models/task/ITask';
import {Lecture} from '../models/Lecture';


@JsonController('/duplicate')
@UseBefore(passportJwtMiddleware)
@Authorized(['teacher', 'admin'])
export class DuplicationController {

  @Post('/course/:id')
  duplicateCourse(@Body() data: any, @Req() request: Request) {
    // TODO
  }

  @Post('/lecture/:id')
  duplicateLecture(@Body() data: any, @Req() request: Request) {
    // TODO
  }

  @Post('/unit/:id')
  duplicateUnit(@Body() data: any, @Req() request: Request) {
    // TODO
  }

  duplicateUnit(unit: IUnit) {
    // TODO
  }
}
