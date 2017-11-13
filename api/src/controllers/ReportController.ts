import {
  Authorized,
  BadRequestError, Body, CurrentUser, Get, JsonController, Param, Post, Put,
  UseBefore
} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {IProgressModel, Progress} from '../models/Progress';
import {IProgress} from '../../../shared/models/IProgress';
import {IUser} from '../../../shared/models/IUser';
import {Unit} from '../models/units/Unit';
import * as mongoose from 'mongoose';
import ObjectId = mongoose.Types.ObjectId;
import {Course} from '../models/Course';
import {Lecture} from '../models/Lecture';

@JsonController('/report')
@UseBefore(passportJwtMiddleware)
@Authorized(['teacher', 'admin'])
export class ReportController {

  @Get('/units/:id')
  getUnitProgress(@Param('id') id: string) {
    return Progress.find({'unit': id})
    .then((progresses) => progresses.map((progress) => progress.toObject({virtuals: true})));
  }

  @Get('/courses/:id')
  getCourseProgress(@Param('id') id: string) {
    return Course.aggregate([
      {$match: {_id: new ObjectId(id)}},
      {$unwind: { path: '$lectures', preserveNullAndEmptyArrays: true }},
      {$lookup: { from: 'lectures', localField: 'lectures', foreignField: '_id', as: 'lectures'}},
      {$lookup: { from: 'units', localField: 'lectures.units', foreignField: '_id', as: 'units'}}
    ])
    .then((courseBaseData) => {
      return courseBaseData;
    });
  }

  @Get('/users/:id')
  getUserProgress(@Param('id') id: string) {
    return Progress.find({'user': id})
    .then((progresses) => progresses.map((progress) => progress.toObject({virtuals: true})));
  }

  @Post('/')
  createProgress(@Body() data: any, @CurrentUser() currentUser?: IUser) {
    // discard invalid requests
    if (!data.course || !data.unit || !currentUser) {
      throw new BadRequestError('progress need fields course, user and unit');
    }

    data.user = currentUser;

    return new Progress(data).save()
    .then((progress) => progress.toObject());
  }

  @Put('/:id')
  updateCodeKataUnit(@Param('id') id: string, @Body() unit: IProgress) {
    return Progress.findByIdAndUpdate(id, unit)
    .then(u => u.toObject());
  }
}
