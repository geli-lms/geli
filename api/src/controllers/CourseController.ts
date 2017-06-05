import {Request} from 'express';
import {Body, Get, Post, Put, Param, Req, JsonController, UseBefore, UploadedFile} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';

import {Course} from '../models/Course';
import {User} from '../models/User';
import {ICourse} from '../../../shared/models/ICourse';
import {IUserModel} from '../models/User';
import {IUser} from '../../../shared/models/IUser';
import {ObsCsvParser} from '../common/obsCsvParser';

@JsonController('/courses')
@UseBefore(passportJwtMiddleware)
export class CourseController {

  parser: ObsCsvParser =  new ObsCsvParser();

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
          path: 'units'
        }
      })
      .populate('courseAdmin')
      .populate('students')
      .then((course) => {
        return course.toObject();
      });
  }

  @Post('/')
  addCourse(@Body() course: ICourse, @Req() request: Request) {
    course.courseAdmin = <IUserModel>(<any>request).user;

    return new Course(course).save()
      .then((c) => c.toObject());
  }

  @Post('/:id/enroll')
  enrollStudent(@Param('id') id: string, @Body() user: IUser) {
    return Course.findById(id)
      .then((c) => {
        if (c.students.indexOf(user._id) < 0) {
          c.students.push(user);
        }
        return c.save().then((course) => course.toObject());
      });
  }


  @Post('/:id/whitelist')
  whitelistStudents(@Param('id') id: string, @UploadedFile('file') file: any) {
    const mimetype: string = file.mimetype;
    if (mimetype !== 'application/vnd.ms-excel') {
      throw new TypeError ('Wrong MimeType allowed are just csv files.');
    }
    return User.find({})
      .then((users) => users.map((user) => user.toObject({ virtuals: true})))
      .then((users) => Course.findById(id).then((course) => {
      return this.parser.work(file, course, users).save().then((c: any) => c.toObject());
    }));
  }


  @Put('/:id')
  updateCourse(@Param('id') id: string, @Body() course: ICourse) {
    return Course.findByIdAndUpdate(id, course, {'new': true})
      .then((c) => c.toObject());
  }
}
