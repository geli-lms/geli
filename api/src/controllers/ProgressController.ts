import {Get, JsonController, Param} from 'routing-controllers';
import {Progress} from '../models/Progress';

@JsonController('/progress')
export class ProgressController {

  @Get('/courses/:id')
  getCourseProgress(@Param('id') id: string) {
  }

  @Get('/users/:id')
  getUserProgress(@Param('id') id: string) {
    return Progress.find({'user': id})
      .then((progresses) => progresses.map((progress) => progress.toObject({virtuals: true})));
  }
}
