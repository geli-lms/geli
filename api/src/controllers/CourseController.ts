import {Request} from 'express';
import {
  Authorized, BadRequestError,
  Body,
  CurrentUser, Delete, ForbiddenError,
  Get,
  JsonController, NotFoundError,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseBefore
} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import * as errorCodes from '../config/errorCodes';

import {ICourse} from '../../../shared/models/ICourse';
import {IUser} from '../../../shared/models/IUser';
import {ObsCsvController} from './ObsCsvController';
import {Course, ICourseModel} from '../models/Course';
import {User} from '../models/User';
import {WhitelistUser} from '../models/WhitelistUser';
import emailService from '../services/EmailService';

const multer = require('multer');
import crypto = require('crypto');
import {IUnitModel} from '../models/units/Unit';
import {API_NOTIFICATION_TYPE_ALL_CHANGES, API_NOTIFICATION_TYPE_NONE, NotificationSettings} from '../models/NotificationSettings';
import {Notification} from '../models/Notification';
import * as mongoose from 'mongoose';
import {Schema} from 'mongoose';
import ObjectId = mongoose.Types.ObjectId;
import {IWhitelistUser} from '../../../shared/models/IWhitelistUser';

const uploadOptions = {
  storage: multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      cb(null, 'tmp/');
    },
    filename: (req: any, file: any, cb: any) => {
      const extPos = file.originalname.lastIndexOf('.');
      const ext = (extPos !== -1) ? `.${file.originalname.substr(extPos + 1).toLowerCase()}` : '';
      crypto.pseudoRandomBytes(16, (err, raw) => {
        cb(err, err ? undefined : `${raw.toString('hex')}${ext}`);
      });
    }
  }),
};


@JsonController('/courses')
@UseBefore(passportJwtMiddleware)
export class CourseController {

  parser: ObsCsvController = new ObsCsvController();

  /**
   * @api {get} /api/courses/ Request courses of current user
   * @apiName GetCourses
   * @apiGroup Course
   *
   * @apiParam {IUser} currentUser Currently logged in user.
   *
   * @apiSuccess {Course[]} courses List of courses.
   *
   * @apiSuccessExample {json} Success-Response:
   *     [
   *         {
   *             "_id": "5a037e6b60f72236d8e7c83b",
   *             "updatedAt": "2018-01-29T20:26:35.204Z",
   *             "createdAt": "2017-11-08T22:00:11.262Z",
   *             "name": "Advanced web development",
   *             "description": "Learn all the things! Angular, Node, Express, MongoDB, TypeScript ...",
   *             "courseAdmin": {
   *                 "_id": "5a037e6a60f72236d8e7c817",
   *                 "updatedAt": "2017-11-08T22:00:10.899Z",
   *                 "createdAt": "2017-11-08T22:00:10.899Z",
   *                 "email": "teacher4@test.local",
   *                 "__v": 0,
   *                 "isActive": true,
   *                 "role": "teacher",
   *                 "profile": {
   *                     "firstName": "Severus",
   *                     "lastName": "Snap"
   *                 },
   *                 "id": "5a037e6a60f72236d8e7c817"
   *             },
   *             "active": true,
   *             "__v": 3,
   *             "whitelist": [],
   *             "enrollType": "free",
   *             "lectures": [],
   *             "students": [],
   *             "teachers": [],
   *             "hasAccessKey": false
   *         },
   *         {
   *             "_id": "5a037e6b60f72236d8e7c83d",
   *             "updatedAt": "2017-11-08T22:00:11.869Z",
   *             "createdAt": "2017-11-08T22:00:11.263Z",
   *             "name": "Introduction to web development",
   *             "description": "Whether you're just getting started with Web development or are just expanding your horizons...",
   *             "courseAdmin": {
   *                 "_id": "5a037e6a60f72236d8e7c815",
   *                 "updatedAt": "2017-11-08T22:00:10.898Z",
   *                 "createdAt": "2017-11-08T22:00:10.898Z",
   *                 "email": "teacher2@test.local",
   *                 "__v": 0,
   *                 "isActive": true,
   *                 "role": "teacher",
   *                 "profile": {
   *                     "firstName": "Ober",
   *                     "lastName": "Lehrer"
   *                 },
   *                 "id": "5a037e6a60f72236d8e7c815"
   *             },
   *             "active": true,
   *             "__v": 1,
   *             "whitelist": [],
   *             "enrollType": "free",
   *             "lectures": [],
   *             "students": [],
   *             "teachers": [],
   *             "hasAccessKey": false
   *         }
   *     ]
   */
  @Get('/')
  async getCourses(@CurrentUser() currentUser: IUser) {
    const whitelistUsers = await WhitelistUser.find({uid: currentUser.uid});
    const conditions = this.userReadConditions(currentUser);
    if (conditions.$or) {
      // Everyone is allowed to see free courses in overview
      conditions.$or.push({enrollType: 'free'});
      conditions.$or.push({enrollType: 'accesskey'});
      conditions.$or.push({enrollType: 'whitelist', whitelist:  {$elemMatch: {$in: whitelistUsers}}});
    }

    const courses = await Course.find(conditions);
    return await Course.getSanitized(
      currentUser, courses,
      {
        all: {
          copy: [
            '_id',
            'active',
            'createdAt',
            'description',
            'enrollType',
            'hasAccessKey',
            'name',
            'updatedAt',
          ],
          onlyid: [
            'courseAdmin',
          ]
        },
        safe: {
          empty: [
            'teachers'
          ],
          selfid: [
            'students'
          ]
        },
        editor: {
          onlyid: [
            'teachers'
          ]
        }
      }
    );
  }

  /**
   * @api {get} /api/courses/:id Request course with certain ID
   * @apiName GetCourse
   * @apiGroup Course
   *
   * @apiParam {String} id Course ID.
   * @apiParam {IUser} currentUser Currently logged in user.
   *
   * @apiSuccess {Course} course Course.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "_id": "5a037e6b60f72236d8e7c83d",
   *         "updatedAt": "2017-11-08T22:00:11.869Z",
   *         "createdAt": "2017-11-08T22:00:11.263Z",
   *         "name": "Introduction to web development",
   *         "description": "Whether you're just getting started with Web development or are just expanding your horizons...",
   *         "courseAdmin": {
   *             "_id": "5a037e6a60f72236d8e7c815",
   *             "updatedAt": "2017-11-08T22:00:10.898Z",
   *             "createdAt": "2017-11-08T22:00:10.898Z",
   *             "email": "teacher2@test.local",
   *             "isActive": true,
   *             "role": "teacher",
   *             "profile": {
   *                 "firstName": "Ober",
   *                 "lastName": "Lehrer"
   *             },
   *             "id": "5a037e6a60f72236d8e7c815"
   *         },
   *         "active": true,
   *         "__v": 1,
   *         "whitelist": [],
   *         "enrollType": "free",
   *         "lectures": [],
   *         "students": [],
   *         "teachers": [],
   *         "id": "5a037e6b60f72236d8e7c83d",
   *         "hasAccessKey": false
   *     }
   *
   * @apiError NotFoundError Includes implicit authorization check.
   * @apiError ForbiddenError (Redundant) Authorization check.
   */
  @Get('/:id')
  async getCourse(@Param('id') id: string, @CurrentUser() currentUser: IUser) {
    const course = await Course.findOne({
      ...this.userReadConditions(currentUser),
      _id: id
    });

    if (!course) {
      throw new NotFoundError();
    }

    // This is currently a redundant check, because userReadConditions above already restricts access!
    // (I.e. just in case future changes break something.)
    if (!course.checkPrivileges(currentUser).userCanViewCourse) {
      throw new ForbiddenError();
    }

    const isTeacherOrAdmin = (currentUser.role === 'teacher' || currentUser.role === 'admin');

    await course.populate({
      path: 'lectures',
      populate: {
        path: 'units',
        virtuals: true,
        match: {$or: [{visible: undefined}, {visible: true}, {visible: !isTeacherOrAdmin}]},
        populate: {
          path: 'progressData',
          match: {user: {$eq: currentUser._id}}
        }
      }
    })
      .populate('media')
      .populate('courseAdmin')
      .populate('teachers')
      .populate('students')
      .populate('whitelist')
      .execPopulate();

    course.lectures = await Promise.all(course.lectures.map(async (lecture) => {
      lecture.units = await Promise.all(lecture.units.map(async (unit: IUnitModel) => {
        unit = await unit.populateUnit();
        return unit.secureData(currentUser);
      }));

      return lecture;
    }));

    return course.toObject();
  }

  private userReadConditions(currentUser: IUser) {
    const conditions: any = {};

    if (currentUser.role === 'admin') {
      return conditions;
    }

    conditions.$or = [];

    if (currentUser.role === 'student') {
      conditions.active = true;
      conditions.$or.push({students: currentUser._id});
    } else {
      conditions.$or.push({teachers: currentUser._id});
      conditions.$or.push({courseAdmin: currentUser._id});
    }

    return conditions;
  }

  /**
   * @api {post} /api/courses/ Add course
   * @apiName PostCourse
   * @apiGroup Course
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {ICourse} course New course data.
   * @apiParam {Request} request Request.
   * @apiParam {IUser} currentUser Currently logged in user.
   *
   * @apiSuccess {Course} course Added course.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "_id": "5a037e6b60f72236d8e7c83d",
   *         "updatedAt": "2017-11-08T22:00:11.869Z",
   *         "createdAt": "2017-11-08T22:00:11.263Z",
   *         "name": "Introduction to web development",
   *         "description": "Whether you're just getting started with Web development or are just expanding your horizons...",
   *         "courseAdmin": {
   *             "_id": "5a037e6a60f72236d8e7c815",
   *             "updatedAt": "2017-11-08T22:00:10.898Z",
   *             "createdAt": "2017-11-08T22:00:10.898Z",
   *             "email": "teacher2@test.local",
   *             "isActive": true,
   *             "role": "teacher",
   *             "profile": {
   *                 "firstName": "Ober",
   *                 "lastName": "Lehrer"
   *             },
   *             "id": "5a037e6a60f72236d8e7c815"
   *         },
   *         "active": true,
   *         "__v": 1,
   *         "whitelist": [],
   *         "enrollType": "free",
   *         "lectures": [],
   *         "students": [],
   *         "teachers": [],
   *         "id": "5a037e6b60f72236d8e7c83d",
   *         "hasAccessKey": false
   *     }
   *
   * @apiError BadRequestError Course name already in use.
   */
  @Authorized(['teacher', 'admin'])
  @Post('/')
  async addCourse(@Body() course: ICourse, @Req() request: Request, @CurrentUser() currentUser: IUser) {
    // Note that this might technically have a race condition, but it should never matter because the new course ids remain unique.
    // If a strict version is deemed important, see mongoose Model.findOneAndUpdate for a potential approach.
    const existingCourse = await Course.findOne({name: course.name});
    if (existingCourse) {
      throw new BadRequestError(errorCodes.errorCodes.course.duplicateName.code);
    }
    course.courseAdmin = currentUser;
    const newCourse = new Course(course);
    await newCourse.save();
    return newCourse.toObject();
  }

  /**
   * @api {post} /api/courses/mail Send mail to selected users
   * @apiName PostCourseMail
   * @apiGroup Course
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {Object} mailData Mail data.
   * @apiParam {IUser} currentUser Currently logged in user.
   *
   * @apiSuccess {Object} freeFormMail Information about sent email.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "accepted": ["geli.hda@gmail.com"],
   *         "rejected": [],
   *         "envelopeTime": 5,
   *         "messageTime": 4,
   *         "messageSize": 874,
   *         "response": "250 ok:  Message 11936348 accepted",
   *         "envelope": {
   *             "from": "staging.geli.fbi@h-da.de",
   *             "to": ["geli.hda@gmail.com"]
   *         },
   *         "messageId": "<f70858d7-d9f4-3f5b-a833-d94d2a440b33@h-da.de>"
   *     }
   */
  @Authorized(['teacher', 'admin'])
  @Post('/mail')
  sendMailToSelectedUsers(@Body() mailData: any, @CurrentUser() currentUser: IUser) {
    return emailService.sendFreeFormMail({
      ...mailData,
      replyTo: `${currentUser.profile.firstName} ${currentUser.profile.lastName}<${currentUser.email}>`,
    });
  }

  /**
   * @api {post} /api/courses/:id/enroll Enroll current student in course
   * @apiName PostCourseEnroll
   * @apiGroup Course
   * @apiPermission student
   *
   * @apiParam {String} id Course ID.
   * @apiParam {Object} data Data (with access key).
   * @apiParam {IUser} currentUser Currently logged in user.
   *
   * @apiSuccess {Course} course Enrolled course.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "_id": "5a037e6b60f72236d8e7c83d",
   *         "updatedAt": "2017-11-08T22:00:11.869Z",
   *         "createdAt": "2017-11-08T22:00:11.263Z",
   *         "name": "Introduction to web development",
   *         "description": "Whether you're just getting started with Web development or are just expanding your horizons...",
   *         "courseAdmin": {
   *             "_id": "5a037e6a60f72236d8e7c815",
   *             "updatedAt": "2017-11-08T22:00:10.898Z",
   *             "createdAt": "2017-11-08T22:00:10.898Z",
   *             "email": "teacher2@test.local",
   *             "isActive": true,
   *             "role": "teacher",
   *             "profile": {
   *                 "firstName": "Ober",
   *                 "lastName": "Lehrer"
   *             },
   *             "id": "5a037e6a60f72236d8e7c815"
   *         },
   *         "active": true,
   *         "__v": 1,
   *         "whitelist": [],
   *         "enrollType": "free",
   *         "lectures": [],
   *         "students": [],
   *         "teachers": [],
   *         "id": "5a037e6b60f72236d8e7c83d",
   *         "hasAccessKey": false
   *     }
   *
   * @apiError NotFoundError
   * @apiError ForbiddenError Not allowed to join, you are not on whitelist.
   * @apiError ForbiddenError Incorrect or missing access key.
   */
  @Authorized(['student'])
  @Post('/:id/enroll')
  async enrollStudent(@Param('id') id: string, @Body() data: any, @CurrentUser() currentUser: IUser) {
    let course = await Course.findById(id);
    if (!course) {
      throw new NotFoundError();
    }
    if (course.enrollType === 'whitelist') {
      const wUsers: IWhitelistUser[] = await  WhitelistUser.find().where({courseId: course._id});
      if (wUsers.filter(e =>
        e.firstName === currentUser.profile.firstName.toLowerCase()
        && e.lastName === currentUser.profile.lastName.toLowerCase()
        && e.uid === currentUser.uid).length <= 0) {
        throw new ForbiddenError(errorCodes.errorCodes.course.notOnWhitelist.code);
      }
    } else if (course.accessKey && course.accessKey !== data.accessKey) {
      throw new ForbiddenError(errorCodes.errorCodes.course.accessKey.code);
    }

    if (course.students.indexOf(currentUser._id) < 0) {
      course.students.push(currentUser);
      await new NotificationSettings({
        'user': currentUser, 'course': course,
        'notificationType': API_NOTIFICATION_TYPE_ALL_CHANGES,
        'emailNotification': false
      }).save();
      course = await course.save();
    }
    return course.toObject();
  }

  /**
   * @api {post} /api/courses/:id/leave Sign out current student from course
   * @apiName PostCourseLeave
   * @apiGroup Course
   * @apiPermission student
   *
   * @apiParam {String} id Course ID.
   * @apiParam {Object} data Body.
   * @apiParam {IUser} currentUser Currently logged in user.
   *
   * @apiSuccess {Course} course Left course.
   *
   * @apiSuccessExample {json} Success-Response:
   *      {result: true}
   *
   * @apiError NotFoundError
   * @apiError ForbiddenError
   */
  @Authorized(['student'])
  @Post('/:id/leave')
  async leaveStudent(@Param('id') id: string, @Body() data: any, @CurrentUser() currentUser: IUser) {
    const course = await Course.findById(id);
    if (!course) {
      throw new NotFoundError();
    }
    const index: number = course.students.indexOf(currentUser._id);
    if (index >= 0) {
      course.students.splice(index, 1);
      await NotificationSettings.findOne({'user': currentUser, 'course': course}).remove();
      await course.save();
      return {result: true};
    } else {
      // This equals an implicit !course.checkPrivileges(currentUser).userIsCourseStudent check.
      throw new ForbiddenError();
    }
  }


  /**
   * @api {post} /api/courses/:id/whitelist Whitelist students for course
   * @apiName PostCourseWhitelist
   * @apiGroup Course
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {String} id Course ID.
   * @apiParam {Object} file Uploaded file.
   *
   * @apiSuccess {Course} course Updated course.
   *
   * @apiSuccessExample {json} Success-Response:
   *    {
   *      success: true,
   *      newlength: 10
   *    }
   *
   * @apiError TypeError Only CSV files are allowed.
   * @apiError HttpError UID is not a number 1.
   * @apiError ForbiddenError Unauthorized user.
   */
  @Authorized(['teacher', 'admin'])
  @Post('/:id/whitelist')
  async whitelistStudents(
    @Param('id') id: string,
    @UploadedFile('file', {options: uploadOptions}) file: any,
    @CurrentUser() currentUser: IUser) {
    const name: string = file.originalname;
    if (!name.endsWith('.csv')) {
      throw new TypeError(errorCodes.errorCodes.upload.type.notCSV.code);
    }
    const course = await Course.findById(id);
    if (!course.checkPrivileges(currentUser).userCanEditCourse) {
      throw new ForbiddenError();
    }
    await course
      .populate('whitelist')
      .populate('students')
      .execPopulate();
    const buffer = <string> await this.parser.parseFile(file);
    await this.parser.updateCourseFromBuffer(buffer, course);
    await course.save();
    return {success: true, newlength: course.whitelist.length};
  }

  /**
   * @api {put} /api/courses/:id Update course
   * @apiName PutCourse
   * @apiGroup Course
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {String} id Course ID.
   * @apiParam {ICourse} course New course data.
   * @apiParam {IUser} currentUser Currently logged in user.
   *
   * @apiSuccess {Course} course Updated course.
   *
   * @apiSuccessExample {json} Success-Response:
   *    {
   *      _id: "5a037e6b60f72236d8e7c83d",
   *      name: "Introduction to web development",
   *      success: true
   *    }
   *
   * @apiError NotFoundError Can't find the course. (Includes implicit authorization check.)
   */
  @Authorized(['teacher', 'admin'])
  @Put('/:id')
  async updateCourse(@Param('id') id: string, @Body() course: ICourse, @CurrentUser() currentUser: IUser) {
    const conditions: any = {_id: id};
    if (currentUser.role !== 'admin') {
      conditions.$or = [
        {teachers: currentUser._id},
        {courseAdmin: currentUser._id}
      ];
    }
    const updatedCourse = await Course.findOneAndUpdate(conditions, course, {'new': true});
    if (updatedCourse) {
      return {_id: updatedCourse.id, name: updatedCourse.name, success: true};
    } else {
      throw new NotFoundError();
    }
  }

  /**
   * @api {delete} /api/courses/:id Delete course
   * @apiName DeleteCourse
   * @apiGroup Course
   *
   * @apiParam {String} id Course ID.
   * @apiParam {IUser} currentUser Currently logged in user.
   *
   * @apiSuccess {Boolean} result Confirmation of deletion.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "result": true
   *     }
   *
   * @apiError NotFoundError
   * @apiError ForbiddenError
   */
  @Authorized(['teacher', 'admin'])
  @Delete('/:id')
  async deleteCourse(@Param('id') id: string, @CurrentUser() currentUser: IUser) {
    const course = await Course.findById(id);
    if (!course) {
      throw new NotFoundError();
    }
    if (!course.checkPrivileges(currentUser).userCanEditCourse) {
      throw new ForbiddenError();
    }
    await course.remove();
    return {result: true};
  }
}
