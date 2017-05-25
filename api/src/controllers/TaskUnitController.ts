import {Request} from 'express';
import {Body, Get, Post, Put, Param, Req, JsonController, UseBefore, Delete} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';

import {Task} from '../models/Task';
import {ITask} from '../../../shared/models/ITask';
import {Unit} from '../models/units/Unit';

@JsonController('unit/tasks')
@UseBefore(passportJwtMiddleware)
export class TaskUnitController {

  @Post('/')
  addTaskUnit(@Body() data: any) {
    // discard invalid requests
    if (!data.lectureId) {
      return;
    }
  }

}
