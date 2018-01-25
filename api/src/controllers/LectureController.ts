import {Request} from 'express';
import {Body, Get, Post, Put, Delete, Param, Req, JsonController, UseBefore, Authorized} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';

import {Lecture} from '../models/Lecture';
import {ILecture} from '../../../shared/models/ILecture';
import {Course} from '../models/Course';

@JsonController('/lecture')
@UseBefore(passportJwtMiddleware)
export class LectureController {

  /**
   * @api {get} /api/lecture Request lecture
   * @apiName GetLecture
   * @apiGroup Lecture
   *
   * @apiParam {String} id Lecture ID.
   *
   * @apiSuccess {Lecture} lecture Lecture.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         TODO
   *     }
   */
  @Get('/:id')
  getLecture(@Param('id') id: string) {
    return Lecture.findById(id)
      .then((l) => l.toObject());
  }

  /**
   * @api {post} /api/lecture Add lecture
   * @apiName PostLecture
   * @apiGroup Lecture
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {Object} data New lecture data.
   * @apiParam {Request} request Request.
   *
   * @apiSuccess {Lecture} lecture Added lecture.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         TODO
   *     }
   */
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

  /**
   * @api {put} /api/lecture Update lecture
   * @apiName PutLecture
   * @apiGroup Lecture
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {String} id Lecture ID.
   * @apiParam {ILecture} lecture New lecture data.
   *
   * @apiSuccess {Lecture} lecture Updated lecture.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         TODO
   *     }
   */
  @Authorized(['teacher', 'admin'])
  @Put('/:id')
  updateLecture(@Param('id') id: string, @Body() lecture: ILecture) {
    return Lecture.findByIdAndUpdate(id, lecture, {'new': true})
      .then((l) => l.toObject());
  }

  /**
   * @api {delete} /api/lecture Delete lecture
   * @apiName DeleteLecture
   * @apiGroup Lecture
   *
   * @apiParam {String} id Lecture ID.
   *
   * @apiSuccess {Boolean} result Confirmation of deletion.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "result": true
   *     }
   */
  @Delete('/:id')
  deleteLecture(@Param('id') id: string) {
    return Course.update({}, {$pull: {lectures: id}})
      .then(() => Lecture.findById(id))
      .then((lecture) => lecture.remove());
  }
}
