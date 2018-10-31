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

  /**
   * @api {get} /api/report/overview/courses/:id Request course overview
   * @apiName GetCourseOverview
   * @apiGroup Report
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {String} id Course ID.
   * @apiParam {IUser} currentUser Currently logged in user.
   *
   * @apiSuccess {Object} course Course with progress stats.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "_id": "5a53c474a347af01b84e54b7",
   *         "name": "Test 101",
   *         "lectures": [{
   *             "_id": "5ab18d7defbc191b10dad856",
   *             "name": "Lecture One",
   *             "units": [{
   *                 "_id": "5ab2b80a6fab4a3ae0cd672d",
   *                 "updatedAt": "2018-03-21T19:56:13.326Z",
   *                 "createdAt": "2018-03-21T19:52:42.716Z",
   *                 "_course": "5a53c474a347af01b84e54b7",
   *                 "progressable": true,
   *                 "weight": 0,
   *                 "name": "Progressable unit",
   *                 "description": null,
   *                 "deadline": "2018-03-21T22:59:00.000Z",
   *                 "__v": 1,
   *                 "__t": "task",
   *                 "tasks": [...],
   *                 "progressData": [{
   *                     "name": "nothing",
   *                     "value": -1
   *                 }, {
   *                     "name": "tried",
   *                     "value": 1
   *                 }, {
   *                     "name": "done",
   *                     "value": 0
   *                 }]
   *             }]
   *         }],
   *         "students": [],
   *         "hasAccessKey": false
   *     }
   *
   * @apiError ForbiddenError You are no admin or teacher for this course.
   */
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
    const courseObj = this.countUnitsAndRemoveEmptyLectures(courseObjUnfiltered, currentUser).courseObj;
    courseObj.lectures.map((lecture: ILecture) => {
      lecture.units.map((unit) => {
        const progressStats = this.calculateProgress(unitProgressData, courseObj.students.length, unit);

        unit.progressData = [
          { name: 'nothing', value: progressStats.nothing },
          { name: 'tried', value: progressStats.tried },
          { name: 'done', value: progressStats.done }
        ];
      });
    });

    return courseObj;
  }

  /**
   * @api {get} /api/report/result/courses/:id Request course results
   * @apiName GetCourseResult
   * @apiGroup Report
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {String} id Course ID.
   * @apiParam {IUser} currentUser Currently logged in user.
   *
   * @apiSuccess {Object[]} students Students with units and progress stats.
   *
   * @apiSuccessExample {json} Success-Response:
   *     [{
   *         "_id": "5954c62923de070007fad047",
   *         "updatedAt": "2017-06-29T09:19:54.227Z",
   *         "createdAt": "2017-06-29T09:19:37.436Z",
   *         "email": "geli.hda@gmail.com",
   *         "uid": "744961",
   *         "__v": 0,
   *         "isActive": true,
   *         "lastVisitedCourses": [],
   *         "role": "student",
   *         "profile": {
   *             "lastName": "Gerhard Paule",
   *             "firstName": "Von Schröder"
   *         },
   *         "id": "5954c62923de070007fad047",
   *         "progress": {
   *             "units": [],
   *             "stats": [{
   *                 "name": "Progress",
   *                 "series": [{
   *                     "name": "nothing",
   *                     "value": 4
   *                 }, {
   *                     "name": "tried",
   *                     "value": 0
   *                 }, {
   *                     "name": "done",
   *                     "value": 0
   *                 }]
   *             }]
   *         }
   *     }, {
   *         "_id": "59fc9fbc6405b400085564c6",
   *         "updatedAt": "2018-01-25T10:02:48.569Z",
   *         "createdAt": "2017-11-03T16:56:28.167Z",
   *         "email": "mueller.dav+test@gmail.com",
   *         "__v": 0,
   *         "isActive": true,
   *         "lastVisitedCourses": ["597df6d5b7a9c0000616637f", "5a5f3b70b5cbe70006f9befc", "5953e5b868f8c80007898785"],
   *         "role": "admin",
   *         "profile": {
   *             "firstName": "Test12",
   *             "lastName": "Schmidt",
   *             "theme": "default"
   *         },
   *         "id": "59fc9fbc6405b400085564c6",
   *         "progress": {
   *             "units": [],
   *             "stats": [{
   *                 "name": "Progress",
   *                 "series": [{
   *                     "name": "nothing",
   *                     "value": 4
   *                 }, {
   *                     "name": "tried",
   *                     "value": 0
   *                 }, {
   *                     "name": "done",
   *                     "value": 0
   *                 }]
   *             }]
   *         }
   *     }, {
   *         "_id": "597dfde2b7a9c0000616639d",
   *         "updatedAt": "2018-01-25T10:48:21.987Z",
   *         "createdAt": "2017-07-30T15:40:18.912Z",
   *         "email": "mueller.dav+gelistudent@gmail.com",
   *         "uid": "123456",
   *         "__v": 0,
   *         "isActive": true,
   *         "lastVisitedCourses": ["5a5f3b70b5cbe70006f9befc", "597df6d5b7a9c0000616637f", "5a134dcc104f7700067562c0"],
   *         "role": "student",
   *         "profile": {
   *             "firstName": "Davidstudent1",
   *             "lastName": "Müllerstudent2"
   *         },
   *         "id": "597dfde2b7a9c0000616639d",
   *         "progress": {
   *             "units": [],
   *             "stats": [{
   *                 "name": "Progress",
   *                 "series": [{
   *                     "name": "nothing",
   *                     "value": 4
   *                 }, {
   *                     "name": "tried",
   *                     "value": 0
   *                 }, {
   *                     "name": "done",
   *                     "value": 0
   *                 }]
   *             }]
   *         }
   *     }]
   *
   * @apiError ForbiddenError You are no admin or teacher for this course.
   */
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
      };
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
    .populate('teachers')
    .populate('courseAdmin')
    .exec();
  }

  /**
   * @api {get} /api/report/details/courses/:courseId/units/:unitId Request unit progress
   * @apiName GetUnitDetails
   * @apiGroup Report
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {String} courseId Course ID.
   * @apiParam {String} unitId Unit ID.
   * @apiParam {IUser} currentUser Currently logged in user.
   *
   * @apiSuccess {Object} report Unit and students with progress stats.
   *
   * @apiSuccessExample {json} Success-Response:
   *     "summary": {
   *         "_id": "5ab2b80a6fab4a3ae0cd672d",
   *         "updatedAt": "2018-03-21T19:56:13.326Z",
   *         "createdAt": "2018-03-21T19:52:42.716Z",
   *         "_course": "5a53c474a347af01b84e54b7",
   *         "progressable": true,
   *         "weight": 0,
   *         "name": "Progressable unit",
   *         "description": null,
   *         "deadline": "2018-03-21T22:59:00.000Z",
   *         "__v": 1,
   *         "__t": "task",
   *         "tasks": [...],
   *         "progressData": [{
   *             "name": "What's the answer to life and everything?",
   *             "series": [{
   *                 "name": "correct",
   *                 "value": 1
   *             }, {
   *                 "name": "wrong",
   *                 "value": 0
   *             }, {
   *                 "name": "no data",
   *                 "value": 5
   *             }]
   *         }, {
   *             "name": "How are you?",
   *             "series": [{
   *                 "name": "correct",
   *                 "value": 0
   *             }, {
   *                 "name": "wrong",
   *                 "value": 1
   *             }, {
   *                 "name": "no data",
   *                 "value": 5
   *             }]
   *         }, {
   *             "name": "Best questions ever, huh?",
   *             "series": [{
   *                 "name": "correct",
   *                 "value": 1
   *             }, {
   *                 "name": "wrong",
   *                 "value": 0
   *             }, {
   *                 "name": "no data",
   *                 "value": 5
   *             }]
   *         }]
   *     },
   *     "details": [{
   *         "_id": "5954bc9e23de070007fad033",
   *         "updatedAt": "2018-01-25T10:54:35.326Z",
   *         "createdAt": "2017-06-29T08:38:54.864Z",
   *         "email": "max@mustermann.me",
   *         "uid": "12345",
   *         "__v": 0,
   *         "isActive": true,
   *         "lastVisitedCourses": ["597df6d5b7a9c0000616637f", "5a5f3b70b5cbe70006f9befc", "59faf40c772e1300067d2ae6"],
   *         "role": "admin",
   *         "profile": {
   *             "theme": "default",
   *             "lastName": "Mustermann",
   *             "firstName": "Max"
   *         },
   *         "id": "5954bc9e23de070007fad033",
   *         "progress": {
   *             "_id": "5a69b7680146c60006249626",
   *             "done": false,
   *             "updatedAt": "2018-01-25T10:54:32.698Z",
   *             "createdAt": "2018-01-25T10:54:32.698Z",
   *             "unit": "5a460967302ddd0006331075",
   *             "course": "597df6d5b7a9c0000616637f",
   *             "answers": {
   *                 "5a460967302ddd000633106e": {
   *                     "5a460967302ddd0006331070": false,
   *                     "5a460967302ddd000633106f": true
   *                 },
   *                 "5a460967302ddd0006331071": {
   *                     "5a460967302ddd0006331074": false,
   *                     "5a460967302ddd0006331073": false,
   *                     "5a460967302ddd0006331072": true
   *                 }
   *             },
   *             "type": "task-unit-progress",
   *             "user": "5954bc9e23de070007fad033",
   *             "__v": 0,
   *             "__t": "task-unit-progress"
   *         }
   *     }, {
   *         "_id": "5954c62923de070007fad047",
   *         "updatedAt": "2017-06-29T09:19:54.227Z",
   *         "createdAt": "2017-06-29T09:19:37.436Z",
   *         "email": "geli.hda@gmail.com",
   *         "uid": "744961",
   *         "__v": 0,
   *         "isActive": true,
   *         "lastVisitedCourses": [],
   *         "role": "student",
   *         "profile": {
   *             "lastName": "Gerhard Paule",
   *             "firstName": "Von Schröder"
   *         },
   *         "id": "5954c62923de070007fad047"
   *     }]
   *
   * @apiError ForbiddenError You are no admin or teacher for this course.
   */
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

  /**
   * @api {get} /api/report/overview/users/:id Request user overview
   * @apiName GetUserOverview
   * @apiGroup Report
   *
   * @apiParam {String} id User ID.
   * @apiParam {IUser} currentUser Currently logged in user.
   *
   * @apiSuccess {Object[]} courses List of courses with progress stats.
   *
   * @apiSuccessExample {json} Success-Response:
   *     [{
   *         "_id": "5a134dcc104f7700067562c0",
   *         "name": "katacourse",
   *         "lectures": [{...}],
   *         "hasAccessKey": false,
   *         "progressData": [{
   *             "name": "nothing",
   *             "value": 1
   *         }, {
   *             "name": "tried",
   *             "value": 0
   *         }, {
   *             "name": "done",
   *             "value": 0
   *         }]
   *     }, {
   *         "_id": "5a1dc725a61d110008f0f69d",
   *         "name": "Am I hidden?",
   *         "lectures": [{...}, {...}],
   *         "hasAccessKey": false,
   *         "progressData": [{
   *             "name": "nothing",
   *             "value": 1
   *         }, {
   *             "name": "tried",
   *             "value": 1
   *         }, {
   *             "name": "done",
   *             "value": 1
   *         }]
   *     }, {
   *         "_id": "5a5f3b70b5cbe70006f9befc",
   *         "name": "Video-Test",
   *         "lectures": [{...}],
   *         "hasAccessKey": false,
   *         "progressData": [{
   *             "name": "nothing",
   *             "value": 0
   *         }, {
   *             "name": "tried",
   *             "value": 1
   *         }, {
   *             "name": "done",
   *             "value": 0
   *         }]
   *     }]
   *
   * @apiError ForbiddenError
   */
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

    const courses = await coursesPromise;
    const courseObjects: any = courses.map((course: ICourseModel) => <ICourse>course.toObject());
    const aggregatedProgressPromise = courseObjects
      .map((courseObj: ICourse) => { return this.countUnitsAndRemoveEmptyLectures(courseObj, currentUser); })
      .map(async ({courseObj, progressableUnitCount, invisibleUnits}: any) => {
        const userProgressData = await Progress.aggregate([
          {$match: { user: new ObjectId(id), unit: { $nin: invisibleUnits } }},
          {$group: { _id: '$course', progresses: { $push: '$$ROOT' }}}
        ]).exec();
        const progressStats = await this.calculateProgress(userProgressData, progressableUnitCount, courseObj);
        courseObj.progressData = [
          { name: 'not tried', value: progressStats.nothing },
          { name: 'tried', value: progressStats.tried },
          { name: 'solved', value: progressStats.done }
        ];
        return await courseObj;
      });
      const courseObjectsBeforeFilter = await Promise.all(aggregatedProgressPromise);
      const courseObjectsWithProgress = await courseObjectsBeforeFilter.filter((courseObj: any) => {
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

  private countUnitsAndRemoveEmptyLectures(courseObj: ICourse, currentUser: IUser) {
    let progressableUnitCount = 0;
    const invisibleUnits: ObjectId[] = [];
    courseObj.lectures = courseObj.lectures.filter((lecture: ILecture) => {
      lecture.units = lecture.units.filter((unit) => {
        if (unit.visible === false && currentUser.role === 'student') {
          invisibleUnits.push(new ObjectId(unit._id));
        }

        if (currentUser.role === 'student') {
          return unit.progressable && unit.visible;
        } else {
          return unit.progressable;
        }
      });
      progressableUnitCount += lecture.units.length;
      return lecture.units.length > 0;
    });

    return {courseObj, progressableUnitCount, invisibleUnits};
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
