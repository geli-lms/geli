import {
  Authorized,
  BadRequestError, Body, CurrentUser, Get, JsonController, Param, Post, Put,
  UseBefore
} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {Progress} from '../models/Progress';
import {IProgress} from '../../../shared/models/IProgress';
import {IUser} from '../../../shared/models/IUser';
import * as mongoose from 'mongoose';
import ObjectId = mongoose.Types.ObjectId;
import {Course} from '../models/Course';
import {ILecture} from '../../../shared/models/ILecture';
import {IUnit} from '../../../shared/models/units/IUnit';

@JsonController('/report')
@UseBefore(passportJwtMiddleware)
@Authorized(['teacher', 'admin'])
export class ReportController {

  @Get('/units/:id')
  getUnitProgress(@Param('id') id: string) {
    return Progress.find({'unit': id})
    .then((progresses) => progresses.map((progress) => progress.toObject({virtuals: true})));
  }

  @Get('/overview/courses/:id')
  getCourseOverview(@Param('id') id: string) {
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

            const progressStats = {
              nothing: 0,
              tried: 0,
              done: 0
            };

            if (progressIndex > -1) {
              const unitProgressObj = unitProgressData[progressIndex];
              unitProgressObj.progresses.forEach((progressObj: IProgress) => {
                if (progressObj.done) {
                  progressStats.done++;
                } else {
                  progressStats.tried++;
                }
              });

              unitProgressData.splice(progressIndex, 1);
            }

            progressStats.nothing = courseObj.students.length - progressStats.done - progressStats.tried;
            unit.progressData = [
              { name: 'nothing', value: progressStats.nothing },
              { name: 'tried', value: progressStats.tried },
              { name: 'done', value: progressStats.done }
            ];
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

  @Get('/result/courses/:id')
  getCourseResults(@Param('id') id: string) {
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
      {$group: { _id: '$user', progresses: { $push: '$$ROOT' }}}
    ]).exec();

    const promises: Promise<any>[] = [
      coursePromise,
      progressPromise
    ];

    return Promise.all(promises)
      .then(([course, userProgressData]) => {
        const courseObj = course.toObject();
        const progressableUnits: IUnit[] = [];
        courseObj.lectures = courseObj.lectures.forEach((lecture: ILecture) => {
          lecture.units.forEach((unit) => {
            if (unit.progressable) {
              progressableUnits.push(unit);
            }
          });
        });

        courseObj.students.map((student: IUser) => {
          const studentWithUnits: any = student;
          studentWithUnits.progress = {
            units: progressableUnits
          };

          const progressStats = {
            nothing: 0,
            tried: 0,
            done: 0
          };

          const userProgressIndex = userProgressData.findIndex((userProgress: any) => {
            return userProgress._id.toString() === student._id;
          });

          if (userProgressIndex > -1) {
            const userProgressObjects = userProgressData[userProgressIndex];
            userProgressData.splice(userProgressIndex, 1);

            studentWithUnits.progress.units.map((studentUnit: IUnit) => {
              const unitProgressIndex = userProgressObjects.progresses.findIndex((unitProgress: any) => {
                return unitProgress.unit.toString() === studentUnit._id;
              });

              if (unitProgressIndex > -1) {
                const unitProgressObject = userProgressObjects.progresses[unitProgressIndex];
                studentUnit.progressData = unitProgressObject;
                userProgressObjects.progresses.splice(unitProgressIndex, 1);

                if (unitProgressObject.done) {
                  progressStats.done++;
                } else {
                  progressStats.tried++;
                }
              }
            });
          }

          progressStats.nothing = progressableUnits.length - progressStats.done - progressStats.tried;
          studentWithUnits.progress.stats = [
            {
              name: 'Progress',
              series: [
                { name: 'nothing', value: progressStats.nothing },
                { name: 'tried', value: progressStats.tried },
                { name: 'done', value: progressStats.done }
              ]
            },
          ];

          return studentWithUnits;
        });

        return courseObj.students;
      })
      .catch((err) => {
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
