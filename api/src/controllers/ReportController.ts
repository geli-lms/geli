import {Authorized, CurrentUser, ForbiddenError, Get, JsonController, Param, UseBefore} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {Progress} from '../models/progress/Progress';
import {IProgress} from '../../../shared/models/progress/IProgress';
import {IUser} from '../../../shared/models/IUser';
import * as mongoose from 'mongoose';
import ObjectId = mongoose.Types.ObjectId;
import {Course, ICourseModel} from '../models/Course';
import {ILecture} from '../../../shared/models/ILecture';
import {IUnit} from '../../../shared/models/units/IUnit';
import {ICourse} from '../../../shared/models/ICourse';
import {Unit} from '../models/units/Unit';

@JsonController('/report')
@UseBefore(passportJwtMiddleware)
export class ReportController {

  @Get('/overview/courses/:id')
  @Authorized(['teacher', 'admin'])
  async getCourseOverview(@Param('id') id: string, @CurrentUser() currentUser: IUser) {
    const coursePromise = this.createCoursePromise(id);
    const progressPromise = Progress.aggregate([
      {$match: { course: new ObjectId(id) }},
      {$group: { _id: '$unit', progresses: { $push: '$$ROOT' }}}
    ]).exec();

    const [course, unitProgressData] = await Promise.all([coursePromise, progressPromise]);

    this.checkAccess(course, currentUser);

    const courseObjUnfiltered: ICourse = <ICourse>course.toObject();
    const courseObj = this.filterUnits(courseObjUnfiltered).courseObj;
    courseObj.lectures.map((lecture: ILecture) => {
      lecture.units.map((unit) => {
        const progressStats = this.calculateProgress(unitProgressData, courseObj.students.length, unit);

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
  @Authorized(['teacher', 'admin'])
  async getCourseResults(@Param('id') id: string, @CurrentUser() currentUser: IUser) {
    const coursePromise = this.createCoursePromise(id);
    const progressPromise = Progress.aggregate([
      {$match: { course: new ObjectId(id) }},
      {$lookup: { from: 'units', localField: 'unit', foreignField: '_id', as: 'unit' }},
      {$group: { _id: '$user', progresses: { $push: '$$ROOT' }}}
    ]).exec();

    const [course, userProgressDataRaw] = await Promise.all([coursePromise, progressPromise]);

    this.checkAccess(course, currentUser);

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
        // Hydrate and toObject are neccessary to transform all ObjectIds to strings
        let unit = Unit.hydrate(progress.unit.pop()).toObject();
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

  @Get('/details/courses/:courseId/units/:unitId')
  @Authorized(['teacher', 'admin'])
  async getUnitProgress(@Param('courseId') courseId: string, @Param('unitId') unitId: string, @CurrentUser() currentUser: IUser) {
    const coursePromise = Course.findOne({_id: courseId})
      .select({ students: 1 })
      .populate('students')
      .exec();
    const unitPromise = Unit.findOne({_id: unitId}).exec();
    const progressPromise = Progress.find({'unit': unitId}).exec();
    const [course, unit, progresses] = await Promise.all([coursePromise, unitPromise, progressPromise]);

    this.checkAccess(course, currentUser);
    const courseObj: ICourse = <ICourse>course.toObject();
    const students = courseObj.students;

    const progressObjects: IProgress[] = <IProgress[]>progresses.map((progress) => progress.toObject());
    const unitObjWithProgressStats = await unit.calculateProgress(students, progressObjects);

    const studentsWithProgress = students.map((student: IUser) => {
      const studentWithProgress: IUser = student;
      const progressIndex = progressObjects.findIndex((progressObj: any) => {
        return progressObj.user === student._id;
      });

      if (progressIndex > -1) {
        const progressObjForStudent = progressObjects[progressIndex];
        studentWithProgress.progress = progressObjForStudent;
        progressObjects.splice(progressIndex, 1);
      }

      return studentWithProgress;
    });

    const report = {
      summary: unitObjWithProgressStats,
      details: studentsWithProgress
    };

    return report;
  }

  @Get('/overview/users/:id')
  async getUserProgress(@Param('id') id: string, @CurrentUser() currentUser: IUser) {
    if (id !== currentUser._id.toString()) {
      throw new ForbiddenError();
    }

    const coursesPromise = Course.find({ students: new ObjectId(id) })
      .select({
        name: 1
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
      .exec();
    const progressPromise = Progress.aggregate([
      {$match: { user: new ObjectId(id) }},
      {$group: { _id: '$course', progresses: { $push: '$$ROOT' }}}
    ]).exec();

    const [courses, userProgressData] = await Promise.all([coursesPromise, progressPromise]);
    const courseObjects: any = courses.map((course: ICourseModel) => <ICourse>course.toObject());
    const courseObjectsWithProgress = courseObjects
      .map(this.filterUnits)
      .map(({courseObj, progressableUnitCount}: any) => {
        const progressStats = this.calculateProgress(userProgressData, progressableUnitCount, courseObj);
        courseObj.progressData = [
          { name: 'nothing', value: progressStats.nothing },
          { name: 'tried', value: progressStats.tried },
          { name: 'done', value: progressStats.done }
        ];
        return courseObj;
      })
      .filter((courseObj: any) => {
        return courseObj.lectures.length > 0;
      });

    return courseObjectsWithProgress;
  }

  private checkAccess(course: ICourse, user: IUser) {
    let teacherIndex = -2;
    if (course.teachers) {
      teacherIndex = course.teachers.findIndex((teacher: any) => {
        return teacher.toString() === user._id;
      });
    }

    if (user.role !== 'admin' && course.courseAdmin._id.toString() !== user._id.toString() && teacherIndex < 0) {
      throw new ForbiddenError('You are no admin or teacher for this course.');
    }
  }

  private filterUnits(courseObj: ICourse) {
    let progressableUnitCount = 0;
    courseObj.lectures = courseObj.lectures.filter((lecture: ILecture) => {
      lecture.units = lecture.units.filter((unit) => {
        return unit.progressable;
      });
      progressableUnitCount += lecture.units.length;
      return lecture.units.length > 0;
    });

    return {courseObj, progressableUnitCount};
  }

  private calculateProgress(progressData: any, totalCount: number, doc: any) {
    const progressStats = {
      nothing: 0,
      tried: 0,
      done: 0
    };

    const progressIndex = progressData.findIndex((progress: any) => {
      return progress._id.toString() === doc._id.toString();
    });

    if (progressIndex > -1) {
      const unitProgressObj = progressData[progressIndex];
      unitProgressObj.progresses.forEach((progressObj: IProgress) => {
        if (progressObj.done) {
          progressStats.done++;
        } else {
          progressStats.tried++;
        }
      });

      progressData.splice(progressIndex, 1);
    }

    progressStats.nothing = totalCount - progressStats.done - progressStats.tried;

    return progressStats;
  }
}
