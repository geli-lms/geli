import {
  Authorized,
  BadRequestError, Body, CurrentUser, Get, JsonController, Param, Post, Put,
  UseBefore
} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {IProgressModel, Progress} from '../models/Progress';
import {IProgress} from '../../../shared/models/IProgress';
import {IUser} from '../../../shared/models/IUser';
import {IUnitModel, Unit} from '../models/units/Unit';
import * as mongoose from 'mongoose';
import ObjectId = mongoose.Types.ObjectId;
import {Course, ICourseModel} from '../models/Course';
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
    const coursePromise = Course.findOne({_id: id})
    .populate({
      path: 'lectures',
      populate: {
        path: 'units',
        match: { progressable: { $eq: true }}
      }
    })
    .populate('students')
    .exec();

    // TODO: Add group by unit for progress objects
    const progressPromise = Progress.aggregate([
      {$match: { course: new ObjectId(id) }}
    ]).exec();
    const promises: Promise<any>[] = [
      coursePromise,
      progressPromise
    ];

    return Promise.all(promises)
      .then(([course, progresses]) => {
        const debug = 0;
      })
    /*
    .then((course: ICourseModel) => {
      course.lectures = course.lectures.filter((lecture) => {
        return lecture.units.length > 0 ? true : false;
      });
      course.lectures.map((lecture) => {
        lecture.units.map((unit: IUnitModel) => {
          return unit.populate('progress');
        });
      });
      return course.toObject();
    });*/
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
