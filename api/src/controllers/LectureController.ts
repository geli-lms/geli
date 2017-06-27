import {Request} from 'express';
import {Body, Get, Post, Put, Delete, Param, Req, JsonController, UseBefore, Authorized} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';

import {Lecture} from '../models/Lecture';
import {ILecture} from '../../../shared/models/ILecture';
import {Course} from '../models/Course';

@JsonController('/lecture')
@UseBefore(passportJwtMiddleware)
export class LectureController {

  @Get('/:id')
  getLecture(@Param('id') id: string) {
    return Lecture.findById(id)
      .then((l) => l.toObject());
  }

  @Authorized(['teacher', 'admin'])
  @Post('/')
  addLecture(@Body() data: any, @Req() request: Request) {
    const lectureI: ILecture = data.lecture;
    const courseId: string = data.courseId;
    return new Lecture(lectureI).save()
      .then((lecture) => {
        return Course.findById(courseId).then(course => ({course, lecture}));
      })
      .then(({course, lecture}) => {
        course.lectures.push(lecture);
        return course.save().then(updatedCourse => ({course, lecture}));
      })
      .then(({course, lecture}) => lecture.toObject());
  }

  @Authorized(['teacher', 'admin'])
  @Put('/:id')
  updateLecture(@Param('id') id: string, @Body() lecture: ILecture) {
    return Lecture.findByIdAndUpdate(id, lecture, {'new': true})
      .then((l) => l.toObject());
  }

  @Delete('/:id')
  deleteLecture(@Param('id') id: string) {
    return Course.update({}, {$pull: {lectures: id}})
      .then(() => Lecture.findByIdAndRemove(id));
  }
}
