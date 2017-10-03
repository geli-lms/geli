import {Request} from 'express';
import {
  Authorized, BadRequestError,
  Body,
  CurrentUser, ForbiddenError,
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

import {IUserModel, User} from '../models/User';
import {ICourse} from '../../../shared/models/ICourse';
import {IUser} from '../../../shared/models/IUser';
import {ObsCsvController} from './ObsCsvController';
import {Course, ICourseModel} from '../models/Course';
import {WhitelistUser} from '../models/WhitelistUser';
import {ICodeKataUnit} from '../../../shared/models/units/ICodeKataUnit';

const multer = require('multer');
import crypto = require('crypto');

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

  @Get('/')
  getCourses(@CurrentUser() currentUser: IUser) {
    const courseQuery = Course.find(this.userReadConditions(currentUser))
    // TODO: Do not send lectures when student has no access
      .populate('lectures')
      .populate('teachers')
      .populate('students');

    return courseQuery
      .then(courses => courses.map(course => {
        const courseObject: any = course.toObject();

        if (currentUser.role === 'student') {
          delete courseObject.courseAdmin;

          courseObject.students = courseObject.students.filter(
            (student: any) => student._id === currentUser._id
          );
        }

        return courseObject;
      }));
  }

  @Get('/:id')
  getCourse(@Param('id') id: string, @CurrentUser() currentUser: IUser) {
    return Course.findOne({
      ...this.userReadConditions(currentUser),
      _id: id
    })
    // TODO: Do not send lectures when student has no access
      .populate({
        path: 'lectures',
        populate: {
          path: 'units',
          populate: {
            path: 'tasks'
          }
        }
      })
      .populate('courseAdmin')
      .populate('teachers')
      .populate('students')
      .then((course) => {
        course.lectures.forEach((lecture) => {
          lecture.units.forEach((unit) => {
            if (unit.type === 'code-kata' && currentUser.role === 'student') {
              (<ICodeKataUnit>unit).code = null;
            }
          });
        });
        return course.toObject();
      });
  }

  private userReadConditions(currentUser: IUser) {
    const conditions: any = {};

    if (currentUser.role === 'admin') {
      return conditions;
    }

    // Everyone is allowed to see free courses
    conditions.$or = [{enrollType: 'free'}];

    if (currentUser.role === 'student') {
      conditions.$or.push({students: currentUser._id});
    } else {
      conditions.$or.push({teachers: currentUser._id});
      conditions.$or.push({courseAdmin: currentUser._id});
    }

    return conditions;
  }

  @Authorized(['teacher', 'admin'])
  @Post('/')
  addCourse(@Body() course: ICourse, @Req() request: Request) {
    course.courseAdmin = (<IUserModel>(<any>request).user);

    return new Course(course).save()
      .then((c) => c.toObject());
  }

  @Authorized(['student'])
  @Post('/:id/enroll')
  enrollStudent(@Param('id') id: string, @Body() data: any, @CurrentUser() currentUser: IUser) {
    return Course.findById(id)
      .then(course => {
        if (!course) {
          throw new NotFoundError();
        }

        if (course.enrollType === 'whitelist') {
          return WhitelistUser.find(course.whitelist).then((wUsers) => {
            if (wUsers.filter(e =>
                e.firstName === currentUser.profile.firstName.toLowerCase()
                && e.lastName === currentUser.profile.lastName.toLowerCase()
                && e.uid === currentUser.uid).length <= 0) {
              throw new ForbiddenError('Not allowed to join, you are not on whitelist.');
            }
          });
        } else if (course.accessKey && course.accessKey !== data.accessKey) {
          throw new ForbiddenError('Incorrect or missing access key');
        }

        if (course.students.indexOf(currentUser._id) < 0) {
          course.students.push(currentUser);

          return course.save().then((c) => c.toObject());
        }

        return course.toObject();
      });
  }

  // TODO: Needs more security
  @Authorized(['teacher', 'admin'])
  @Post('/:id/whitelist')
  whitelistStudents(@Param('id') id: string, @UploadedFile('file', {options: uploadOptions}) file: any) {
    const name: string = file.originalname;

    if (!name.endsWith('.csv')) {
      throw new TypeError('Wrong type allowed are just csv files.');
    }

    // TODO: Never query all users!
    return User.find({})
      .then((users) => users.map((user) => user.toObject({virtuals: true})))
      .then((users) => Course.findById(id).then((course) => {
        return this.parser.parseFile(file).then((buffer: any) =>
          this.parser.updateCourseFromBuffer(buffer, course, users).save().then((c: ICourseModel) =>
            c.toObject()));
      }));
  }

  @Authorized(['teacher', 'admin'])
  @Put('/:id')
  updateCourse(@Param('id') id: string, @Body() course: ICourse, @CurrentUser() currentUser: IUser) {
    const conditions: any = {_id: id};

    if (currentUser.role !== 'admin') {
      conditions.$or = [
        {teachers: currentUser._id},
        {courseAdmin: currentUser._id}
      ];
    }

    return Course.findOneAndUpdate(
      conditions,
      course,
      {'new': true}
    )
      .then((c) => c.toObject());
  }
}
