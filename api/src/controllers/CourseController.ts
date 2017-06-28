import {Request} from 'express';
import {
  Authorized,
  Body,
  Get,
  HttpError,
  JsonController,
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
const multer = require('multer');
import crypto = require('crypto');
const uploadOptions = {
  storage: multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      cb(null, 'temp/');
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
  getCourses() {
    return Course.find({})
    .populate('lectures')
    .populate('courseAdmin')
    .populate('students')
    .then((courses) => courses.map((c) => c.toObject()));
  }

  @Get('/:id')
  getCourse(@Param('id') id: string) {
    return Course.findById(id)
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
    .populate('students')
    .then((course) => {
      return course.toObject();
    });
  }

  @Authorized(['teacher', 'admin'])
  @Post('/')
  addCourse(@Body() course: ICourse, @Req() request: Request) {
    course.courseAdmin = <IUserModel>(<any>request).user;

    return new Course(course).save()
    .then((c) => c.toObject());
  }

  @Post('/:id/enroll')
  enrollStudent(@Param('id') id: string, @Body() data: any) {
    const user: IUser = data.user;
    const accessKey: string = data.accessKey;
    return Course.findById(id)
      .then((c) => {
        if (c.accessKey && c.accessKey !== accessKey) {
          throw new HttpError(401, 'Invalid access key.');
        }
        return WhitelistUser.find(c.whitelist).then((wUsers) => {
          if (c.enrollType === 'whitelist' &&
            wUsers.filter(e =>
            e.firstName === user.profile.firstName.toLowerCase()
            && e.lastName === user.profile.lastName.toLowerCase()
            && e.uid === user.uid).length <= 0) {
            throw new HttpError(401, 'Not allowed to join, you are not on whitelist.');
          }
          if (c.students.indexOf(user._id) < 0) {
            c.students.push(user);
          }
          return c.save().then((course) => course.toObject());
        });
      });
  }


  @Authorized(['teacher', 'admin'])
  @Post('/:id/whitelist')
  whitelistStudents(@Param('id') id: string, @UploadedFile('file', {options: uploadOptions}) file: any) {
    const name: string = file.originalname;
    if (!name.endsWith('.csv')) {
      throw new TypeError('Wrong type allowed are just csv files.');
    }
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
  updateCourse(@Param('id') id: string, @Body() course: ICourse) {
    return Course.findByIdAndUpdate(id, course, {'new': true})
    .then((c) => c.toObject());
  }
}
