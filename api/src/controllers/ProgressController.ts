import * as mongoose from 'mongoose';
import {Get, JsonController, Param} from 'routing-controllers';
import {IProgressModel, Progress} from '../models/Progress';
import {Unit} from '../models/units/Unit';
import {IUserModel, User} from '../models/User';
import {IProgress} from '../../../shared/models/IProgress';
import {CourseController} from './CourseController';
import {Course} from '../models/Course';
import {ICourse} from '../../../shared/models/ICourse';
import {IUnit} from '../../../shared/models/units/IUnit';
import {IUser} from '../../../shared/models/IUser';

@JsonController('/progress')
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
