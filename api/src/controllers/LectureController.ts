import {Request} from 'express';
import {
  Authorized,
  Body, CurrentUser,
  Delete, ForbiddenError,
  Get,
  JsonController,
  NotFoundError,
  Param,
  Post,
  Put,
  Req,
  UseBefore
} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';

import {Lecture} from '../models/Lecture';
import {ILecture} from '../../../shared/models/ILecture';
import {Course} from '../models/Course';
import {Notification} from '../models/Notification';
import {IUser} from '../../../shared/models/IUser';

@JsonController('/lecture')
@UseBefore(passportJwtMiddleware)
export class LectureController {

  /**
   * @api {get} /api/lecture/:id Request lecture
   * @apiName GetLecture
   * @apiGroup Lecture
   *
   * @apiParam {String} id Lecture ID.
   *
   * @apiSuccess {Lecture} lecture Lecture.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "_id": "5a037e6b60f72236d8e7c857",
   *         "updatedAt": "2017-11-08T22:00:11.693Z",
   *         "createdAt": "2017-11-08T22:00:11.693Z",
   *         "name": "Introduction",
   *         "description": "something about me, us, whoever",
   *         "__v": 0,
   *         "units": []
   *     }
   */
  @Get('/:id')
  getLecture(@Param('id') id: string) {
    return Lecture.findById(id)
      .then((l) => l.toObject());
  }

  /**
   * @api {post} /api/lecture/ Add lecture
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
   *         "_id": "5a037e6b60f72236d8e7c857",
   *         "updatedAt": "2017-11-08T22:00:11.693Z",
   *         "createdAt": "2017-11-08T22:00:11.693Z",
   *         "name": "Introduction",
   *         "description": "something about me, us, whoever",
   *         "__v": 0,
   *         "units": []
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
   * @api {put} /api/lecture/:id Update lecture
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
   *         "_id": "5a037e6b60f72236d8e7c857",
   *         "updatedAt": "2018-01-29T23:43:07.220Z",
   *         "createdAt": "2017-11-08T22:00:11.693Z",
   *         "name": "Introduction",
   *         "description": "something about me, us, whoever",
   *         "__v": 0,
   *         "units": []
   *     }
   */
  @Authorized(['teacher', 'admin'])
  @Put('/:id')
  updateLecture(@Param('id') id: string, @Body() lecture: ILecture) {
    return Lecture.findByIdAndUpdate(id, lecture, {'new': true})
      .then((l) => l.toObject());
  }

  /**
   * @api {delete} /api/lecture/:id Delete lecture
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
  @Authorized(['teacher', 'admin'])
  @Delete('/:id')
  async deleteLecture(@Param('id') id: string, @CurrentUser() currentUser: IUser) {
    const course = await Course.findOne({where: {lectures: id}});
    if (!course) {
      throw new NotFoundError();
    }
    if (!course.checkPrivileges(currentUser).userCanEditCourse()) {
      throw new ForbiddenError();
    }
    const success = await course.update({}, {$pull: {lectures: id}});

    return Lecture.findByIdAndRemove(id) && success;
  }
}
