import {Request} from 'express';
import {
  Body, Get, Post, Put, Delete, Param, Req, JsonController, UseBefore, Authorized,
  BadRequestError
} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {FreeTextUnit} from '../models/units/FreeTextUnit';
import {TaskUnit} from '../models/units/TaskUnit';
import {CodeKataUnit} from '../models/units/CodeKataUnit';
import {FileUnit} from '../models/units/FileUnit';
import {VideoUnit} from '../models/units/VideoUnit';
import {IUnit} from '../../../shared/models/units/IUnit';
import {ITaskUnit} from '../../../shared/models/units/ITaskUnit';
import {ITask} from '../../../shared/models/task/ITask';
import {ILectureModel, Lecture} from '../models/Lecture';
import {ILecture} from '../../../shared/models/ILecture';


@JsonController('/duplicate')
@UseBefore(passportJwtMiddleware)
@Authorized(['teacher', 'admin'])
export class DuplicationController {

  @Post('/course/:id')
  duplicateCourse(@Body() data: any, @Req() request: Request) {
    // TODO: status auf nicht sichtbar für students
  }

  @Post('/lecture/:id')
  duplicateLecture(@Param('id') id: string, @Body() data: any, @Req() request: Request) {
    const courseId = data.courseId;
    console.log('courseid: ' + courseId);
    console.log('lectureID: ' + id);
    return Lecture.findById(id)
      .then((lecture: ILecture) => {
        console.log('lecture = ' + lecture);
        return new Lecture(lecture).export();
      }).then((exportedLecture: ILecture) => {
        console.log('exportedLecture = ' + exportedLecture);
        return new Lecture().import(exportedLecture, courseId);
      })
    .catch((error) => {
        throw new BadRequestError(error);
      });
  }

  @Post('/unit/:id')
  duplicateUnit(@Body() data: any, @Req() request: Request) {
    // TODO
  }

}
