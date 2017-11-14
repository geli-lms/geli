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
import {ILecture} from '../../../shared/models/ILecture';

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
    .select({
      name: 1,
      lectures: 1,
      students: 1
    })
    .populate({
      path: 'lectures',
      populate: {
        path: 'units'
      },
      select: {
        name: 1,
        units: 1
      }
    })
    .populate('students')
    .exec();

    const progressPromise = Progress.aggregate([
      {$match: { course: new ObjectId(id) }},
      {$group: { _id: '$unit', progresses: { $push: '$$ROOT' }}}
    ]).exec();

    const promises: Promise<any>[] = [
      coursePromise,
      progressPromise
    ];

    return Promise.all(promises)
      .then(([course, unitProgressData]) => {
        const courseObj = course.toObject();
        courseObj.lectures = courseObj.lectures.filter((lecture: ILecture) => {
          lecture.units = lecture.units.filter((unit) => {
            return unit.progressable;
          });
          return lecture.units.length > 0;
        });
        courseObj.lectures.map((lecture: ILecture) => {
          lecture.units.map((unit) => {
            const progressIndex = unitProgressData.findIndex((unitProgress: any) => {
              return unitProgress._id.toString() === unit._id.toString();
            });

            if (progressIndex > -1) {
              const progressStats = {
                nothing: 0,
                tried: 0,
                done: 0
              };
              const unitProgressObj = unitProgressData[progressIndex];
              unitProgressObj.progresses.forEach((progressObj: IProgress) => {
                if (progressObj.done) {
                  progressStats.done++;
                } else {
                  progressStats.tried++;
                }
              });

              progressStats.nothing = courseObj.students.length - progressStats.done - progressStats.tried;
              unit.progressData = [
                { name: 'nothing', value: progressStats.nothing },
                { name: 'tried', value: progressStats.tried },
                { name: 'done', value: progressStats.done }
              ];
              unitProgressData.splice(progressIndex, 1);
            }
          })
        });

        return courseObj;
      })
      .then((courseWithProgress) => {
        return courseWithProgress;
      })
      .catch((err) => {
        console.log(err);
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
