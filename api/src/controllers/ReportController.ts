import {Authorized, Get, JsonController, Param, UseBefore} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {Progress} from '../models/Progress';
import {IProgress} from '../../../shared/models/IProgress';
import {IUser} from '../../../shared/models/IUser';
import * as mongoose from 'mongoose';
import ObjectId = mongoose.Types.ObjectId;
import {Course} from '../models/Course';
import {ILecture} from '../../../shared/models/ILecture';
import {IUnit} from '../../../shared/models/units/IUnit';
import {ICourse} from '../../../shared/models/ICourse';

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
  async getCourseOverview(@Param('id') id: string) {
    const coursePromise = this.createCoursePromise(id);
    const progressPromise = Progress.aggregate([
      {$match: { course: new ObjectId(id) }},
      {$group: { _id: '$unit', progresses: { $push: '$$ROOT' }}}
    ]).exec();

    const [course, unitProgressData] = await Promise.all([coursePromise, progressPromise]);
    const courseObj: ICourse = <ICourse>course.toObject();
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
  }

  @Get('/result/courses/:id')
  async getCourseResults(@Param('id') id: string) {
    const coursePromise = this.createCoursePromise(id);
    const progressPromise = Progress.aggregate([
      {$match: { course: new ObjectId(id) }},
      {$lookup: { from: 'units', localField: 'unit', foreignField: '_id', as: 'unit' }},
      {$group: { _id: '$user', progresses: { $push: '$$ROOT' }}}
    ]).exec();

    const [course, userProgressDataRaw] = await Promise.all([coursePromise, progressPromise]);
    const courseObj: ICourse = <ICourse>course.toObject();
    const students = courseObj.students;
    const progressableUnits: IUnit[] = [];

    courseObj.lectures.forEach((lecture: ILecture) => {
      lecture.units.forEach((unit) => {
        if (unit.progressable) {
          progressableUnits.push(unit);
        }
      });
    });

    const userProgressData = await userProgressDataRaw.map((userProgress: any) => {
      const remappedProgresses = userProgress.progresses.map((progress: IProgress) => {
        let unit = progress.unit.pop();
        unit = {
          ...unit,
          progressData: progress
        };

        return unit;
      });

      return {
        ...userProgress,
        progresses: remappedProgresses
      }
    });

    const studentsWithUnitsAndProgress = await students.map((student: IUser) => {
      const studentWithUnits: any = student;
      studentWithUnits.progress = {
        units: []
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
        studentWithUnits.progress.units = userProgressObjects.progresses;
        userProgressData.splice(userProgressIndex, 1);

        studentWithUnits.progress.units.forEach((studentUnit: IUnit) => {
          if (studentUnit.hasOwnProperty('progressData')) {
            if (studentUnit.progressData.done) {
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

    return studentsWithUnitsAndProgress;
  }

  private createCoursePromise(courseId: string) {
    return Course.findOne({_id: courseId})
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
  }

  @Get('/users/:id')
  getUserProgress(@Param('id') id: string) {
    return Progress.find({'user': id})
    .then((progresses) => progresses.map((progress) => progress.toObject({virtuals: true})));
  }
}
