import {BadRequestError, Body, Param, Post, Put, UseBefore} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {TaskUnitProgress} from '../models/TaskUnitProgress';
import {JsonController} from 'routing-controllers';
import {ProgressController} from './ProgressController';
import {ITaskUnitProgress} from '../../../shared/models/ITaskUnitProgress';


@JsonController('/progress/taskunit')
@UseBefore(passportJwtMiddleware)
export class TaskUnitProgressController extends ProgressController {

  @Post('/')
  createProgress(@Body() data: any) {
   // discard invalid requests
    if (!data.course || !data.user || !data.unit) {
      return new BadRequestError('progress need fields course, user and unit');
    }

    return new TaskUnitProgress(data).save()
      .then((newTaskUnitProgress) => newTaskUnitProgress.toObject());
  }

  @Put('/:id')
  updateProgress(@Param('id') id: string, @Body() unit: ITaskUnitProgress) {
    return TaskUnitProgress.findByIdAndUpdate(id, unit)
      .then(u => u.toObject());
  }
}
