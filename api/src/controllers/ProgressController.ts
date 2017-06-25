import {BadRequestError, Body, Get, JsonController, Param, Post, Put, UseBefore} from 'routing-controllers';
import {Progress} from '../models/Progress';
import {IProgress} from "../../../shared/models/IProgress";

@JsonController('/progress')
@UseBefore(passportJwtMiddleware)
export class ProgressController {

  @Get('/courses/:id')
  getCourseProgress(@Param('id') id: string) {
    return Progress.find({'course': id})
      .populate('unit')
      .then((progresses) => progresses.map((progress) => progress.toObject({virtuals: true})));
  }

  @Get('/users/:id')
  getUserProgress(@Param('id') id: string) {
    return Progress.find({'user': id})
      .then((progresses) => progresses.map((progress) => progress.toObject({virtuals: true})));
  }

  @Post('/')
  createProgress(@Body() data: any) {
    // discard invalid requests
    if (!data.course || !data.user || !data.unit) {
      return new BadRequestError('progress need fields course, user and unit');
    }

    return new Promise((resolve) => {
      resolve(new Progress(data).save());
    });
  }

  @Put('/:id')
  updateCodeKataUnit(@Param('id') id: string, @Body() unit: IProgress) {
    return Progress.findByIdAndUpdate(id, unit)
      .then(u => u.toObject());
  }
}
