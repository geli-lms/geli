import {Get, JsonController, Param, UseBefore} from 'routing-controllers';
import {Progress} from '../models/Progress';
import passportJwtMiddleware from '../security/passportJwtMiddleware';

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
}
