import {Request} from 'express';
import {Body, Get, Post, Put, Param, Req, JsonController, UseBefore} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';

import {Course} from '../models/Course';
import {ICourse} from '../models/ICourse';
import {IUserModel} from '../models/User';

@JsonController('/courses')
@UseBefore(passportJwtMiddleware)
export class CourseController {

    @Get('/')
    getCourses() {
        return Course.find({})
            .then((courses) => courses.map((c) => c.toObject({ virtuals: true })));
    }

    @Get('/:id')
    getCourse(@Param('id') id: string) {
        return Course.findById(id)
          .populate('lectures')
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

    @Put('/:id')
    updateCourse(@Param('id') id: string, @Body() course: ICourse) {
        return Course.findByIdAndUpdate(id, course, {'new': true})
            .then((c) => c.toObject());
    }
}
