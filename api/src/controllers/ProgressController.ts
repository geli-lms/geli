import {
  BadRequestError, Body, CurrentUser, Get, JsonController, Param, Post, Put,
  UseBefore
} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {Progress} from '../models/Progress';
import {IProgress} from '../../../shared/models/IProgress';
import {IUser} from '../../../shared/models/IUser';
import {Unit} from '../models/units/Unit';
import * as mongoose from 'mongoose';
import ObjectId = mongoose.Types.ObjectId;

@JsonController('/progress')
@UseBefore(passportJwtMiddleware)
export class ProgressController {

  @Get('/units/:id')
  getUnitProgress(@Param('id') id: string) {
    return Progress.find({'unit': id})
      .then((progresses) => progresses.map((progress) => progress.toObject({virtuals: true})));
  }

  @Get('/courses/:id')
  getCourseProgress(@Param('id') id: string) {
    return Unit.aggregate([
      { $match: { $and: [{ _course: new ObjectId(id) }, { progressable: true }]}},
      { $lookup: {
        from: 'progress',
        localField: '_id',
        foreignField: 'unit',
        as: 'progress_data'
      }}
    ])
      .then((result) => {
        const debug = 0;
      });
    /*
    return Progress.find({'course': id})
      .then((progresses) => progresses.map((progress) => progress.toObject({virtuals: true})));
      */
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
