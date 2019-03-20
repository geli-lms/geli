import {
  BadRequestError, Body, CurrentUser, Get, JsonController, Param, Post, Put, UseBefore,
  NotFoundError, ForbiddenError
} from 'routing-controllers';
import * as moment from 'moment';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {Progress} from '../models/progress/Progress';
import {Course} from '../models/Course';
import {Unit, IUnitModel} from '../models/units/Unit';
import {IUser} from '../../../shared/models/IUser';
import {IProgress} from '../../../shared/models/progress/IProgress';
import {extractSingleMongoId} from '../utilities/ExtractMongoId';

@JsonController('/progress')
@UseBefore(passportJwtMiddleware)
export class ProgressController {
  private static checkDeadline(unit: any) {
    if (unit.deadline && moment(unit.deadline).isBefore()) {
      throw new BadRequestError('Past deadline, no further update possible');
    }
  }

  /**
   * @api {get} /api/progress/units/:id Get unit progress
   * @apiName GetUnitProgress
   * @apiGroup Progress
   *
   * @apiParam {String} id Unit ID.
   *
   * @apiSuccess {Progress[]} progresses Progress.
   *
   * @apiSuccessExample {json} Success-Response:
   *     [{
   *         "_id": "5ab2b9516fab4a3ae0cd6737",
   *         "done": false,
   *         "updatedAt": "2018-03-21T19:58:09.386Z",
   *         "createdAt": "2018-03-21T19:58:09.386Z",
   *         "unit": "5ab2b80a6fab4a3ae0cd672d",
   *         "course": "5a53c474a347af01b84e54b7",
   *         "answers": {
   *             "5ab2b80a6fab4a3ae0cd672e": {
   *                 "5ab2b80a6fab4a3ae0cd6730": true,
   *                 "5ab2b80a6fab4a3ae0cd672f": false
   *             },
   *             "5ab2b8dd6fab4a3ae0cd6734": {
   *                 "5ab2b8dd6fab4a3ae0cd6736": false,
   *                 "5ab2b8dd6fab4a3ae0cd6735": true
   *             },
   *             "5ab2b8dd6fab4a3ae0cd6731": {
   *                 "5ab2b8dd6fab4a3ae0cd6733": false,
   *                 "5ab2b8dd6fab4a3ae0cd6732": true
   *             }
   *         },
   *         "type": "task-unit-progress",
   *         "user": "5a037e6a60f72236d8e7c813",
   *         "__v": 0,
   *         "__t": "task-unit-progress",
   *         "id": "5ab2b9516fab4a3ae0cd6737"
   *     }]
   *
   * @apiError ForbiddenError
   */
  @Get('/units/:id')
  async getUnitProgress(@Param('id') id: string, @CurrentUser() currentUser: IUser) {
    const unit = await Unit.findById(id);
    const course = await Course.findById(unit._course);
    if (!course.checkPrivileges(currentUser).userCanViewCourse) {
      throw new ForbiddenError();
    }
    let progressSet = await Progress.find({unit: id});
    if (currentUser.role !== 'teacher' && currentUser.role !== 'admin') {
      // Only send the progress data if the user (student) is the "owner" thereof.
      const currentUserId = extractSingleMongoId(currentUser);
      progressSet = await Promise.all(progressSet.map(
        (progress) => extractSingleMongoId(progress.user) === currentUserId ? progress : undefined));
      progressSet = progressSet.filter((progress) => progress);
    }
    return progressSet.map((progress) => progress.toObject({virtuals: true}));
  }

  /**
   * @api {get} /api/progress/courses/:id Get course progress
   * @apiName GetCourseProgress
   * @apiGroup Progress
   *
   * @apiParam {String} id Course ID.
   *
   * @apiSuccess {Progress[]} progresses List of progress.
   *
   * @apiSuccessExample {json} Success-Response:
   *     [{
   *         "_id": "5ab2b9516fab4a3ae0cd6737",
   *         "done": false,
   *         "updatedAt": "2018-03-21T19:58:09.386Z",
   *         "createdAt": "2018-03-21T19:58:09.386Z",
   *         "unit": "5ab2b80a6fab4a3ae0cd672d",
   *         "course": "5a53c474a347af01b84e54b7",
   *         "answers": {
   *             "5ab2b80a6fab4a3ae0cd672e": {
   *                 "5ab2b80a6fab4a3ae0cd6730": true,
   *                 "5ab2b80a6fab4a3ae0cd672f": false
   *             },
   *             "5ab2b8dd6fab4a3ae0cd6734": {
   *                 "5ab2b8dd6fab4a3ae0cd6736": false,
   *                 "5ab2b8dd6fab4a3ae0cd6735": true
   *             },
   *             "5ab2b8dd6fab4a3ae0cd6731": {
   *                 "5ab2b8dd6fab4a3ae0cd6733": false,
   *                 "5ab2b8dd6fab4a3ae0cd6732": true
   *             }
   *         },
   *         "type": "task-unit-progress",
   *         "user": "5a037e6a60f72236d8e7c813",
   *         "__v": 0,
   *         "__t": "task-unit-progress",
   *         "id": "5ab2b9516fab4a3ae0cd6737"
   *     }]
   */
  // This route has been disabled since it appears to be unused and insufficiently secured.
  /*
  @Get('/courses/:id')
  getCourseProgress(@Param('id') id: string) {
    return Progress.find({'course': id})
      .then((progresses) => progresses.map((progress) => progress.toObject({virtuals: true})));
  }
  */

  /**
   * @api {get} /api/progress/users/:id Get user progress
   * @apiName GetUserProgress
   * @apiGroup Progress
   *
   * @apiParam {String} id User ID.
   *
   * @apiSuccess {Progress[]} progresses List of progress.
   *
   * @apiSuccessExample {json} Success-Response:
   *     [{
   *         "_id": "5ab2b9516fab4a3ae0cd6737",
   *         "done": false,
   *         "updatedAt": "2018-03-21T19:58:09.386Z",
   *         "createdAt": "2018-03-21T19:58:09.386Z",
   *         "unit": "5ab2b80a6fab4a3ae0cd672d",
   *         "course": "5a53c474a347af01b84e54b7",
   *         "answers": {
   *             "5ab2b80a6fab4a3ae0cd672e": {
   *                 "5ab2b80a6fab4a3ae0cd6730": true,
   *                 "5ab2b80a6fab4a3ae0cd672f": false
   *             },
   *             "5ab2b8dd6fab4a3ae0cd6734": {
   *                 "5ab2b8dd6fab4a3ae0cd6736": false,
   *                 "5ab2b8dd6fab4a3ae0cd6735": true
   *             },
   *             "5ab2b8dd6fab4a3ae0cd6731": {
   *                 "5ab2b8dd6fab4a3ae0cd6733": false,
   *                 "5ab2b8dd6fab4a3ae0cd6732": true
   *             }
   *         },
   *         "type": "task-unit-progress",
   *         "user": "5a037e6a60f72236d8e7c813",
   *         "__v": 0,
   *         "__t": "task-unit-progress",
   *         "id": "5ab2b9516fab4a3ae0cd6737"
   *     }]
   */
  // This route has been disabled since it appears to be unused and insufficiently secured.
  /*
  @Get('/users/:id')
  getUserProgress(@Param('id') id: string) {
    return Progress.find({'user': id})
      .then((progresses) => progresses.map((progress) => progress.toObject({virtuals: true})));
  }
  */

  /**
   * @api {post} /api/progress/ Create progress
   * @apiName PostProgress
   * @apiGroup Progress
   *
   * @apiParam {IProgress} data Progress data.
   *
   * @apiParam {String} id Notification ID.@apiSuccess {Progress} progress Created progress.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "_id": "5ab2b9516fab4a3ae0cd6737",
   *         "done": false,
   *         "updatedAt": "2018-03-21T19:58:09.386Z",
   *         "createdAt": "2018-03-21T19:58:09.386Z",
   *         "unit": "5ab2b80a6fab4a3ae0cd672d",
   *         "course": "5a53c474a347af01b84e54b7",
   *         "answers": {
   *             "5ab2b80a6fab4a3ae0cd672e": {
   *                 "5ab2b80a6fab4a3ae0cd6730": true,
   *                 "5ab2b80a6fab4a3ae0cd672f": false
   *             },
   *             "5ab2b8dd6fab4a3ae0cd6734": {
   *                 "5ab2b8dd6fab4a3ae0cd6736": false,
   *                 "5ab2b8dd6fab4a3ae0cd6735": true
   *             },
   *             "5ab2b8dd6fab4a3ae0cd6731": {
   *                 "5ab2b8dd6fab4a3ae0cd6733": false,
   *                 "5ab2b8dd6fab4a3ae0cd6732": true
   *             }
   *         },
   *         "type": "task-unit-progress",
   *         "user": "5a037e6a60f72236d8e7c813",
   *         "__v": 0,
   *         "__t": "task-unit-progress",
   *         "id": "5ab2b9516fab4a3ae0cd6737"
   *     }
   *
   * @apiError BadRequestError progress need fields course, user and unit
   * @apiError ForbiddenError
   */
  @Post('/')
  async createProgress(@Body() data: IProgress, @CurrentUser() currentUser: IUser) {
    // discard invalid requests
    if (!data.course || !data.unit) {
      throw new BadRequestError('progress need fields course, user and unit');
    }

    const unit: IUnitModel = await Unit.findById(data.unit);
    const course = await Course.findById(unit._course);
    if (!course.checkPrivileges(currentUser).userCanViewCourse) {
      throw new ForbiddenError();
    }
    ProgressController.checkDeadline(unit);

    data.user = currentUser;

    const progress = await Progress.create(data);
    return progress.toObject();
  }

  /**
   * @api {put} /api/progress/:id Update progress
   * @apiName PutProgress
   * @apiGroup Progress
   *
   * @apiParam {String} id Progress ID.
   * @apiParam {Object} data New progress data.
   *
   * @apiSuccess {Progress} progress Updated progress.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "_id": "5ab2b9516fab4a3ae0cd6737",
   *         "done": false,
   *         "updatedAt": "2018-03-21T19:58:09.386Z",
   *         "createdAt": "2018-03-21T19:58:09.386Z",
   *         "unit": "5ab2b80a6fab4a3ae0cd672d",
   *         "course": "5a53c474a347af01b84e54b7",
   *         "answers": {
   *             "5ab2b80a6fab4a3ae0cd672e": {
   *                 "5ab2b80a6fab4a3ae0cd6730": true,
   *                 "5ab2b80a6fab4a3ae0cd672f": false
   *             },
   *             "5ab2b8dd6fab4a3ae0cd6734": {
   *                 "5ab2b8dd6fab4a3ae0cd6736": false,
   *                 "5ab2b8dd6fab4a3ae0cd6735": true
   *             },
   *             "5ab2b8dd6fab4a3ae0cd6731": {
   *                 "5ab2b8dd6fab4a3ae0cd6733": false,
   *                 "5ab2b8dd6fab4a3ae0cd6732": true
   *             }
   *         },
   *         "type": "task-unit-progress",
   *         "user": "5a037e6a60f72236d8e7c813",
   *         "__v": 0,
   *         "__t": "task-unit-progress",
   *         "id": "5ab2b9516fab4a3ae0cd6737"
   *     }
   *
   * @apiError NotFoundError
   * @apiError ForbiddenError
   */
  @Put('/:id')
  async updateProgress(@Param('id') id: string, @Body() data: any, @CurrentUser() currentUser: IUser) {
    const progress = await Progress.findById(id);
    if (!progress) {
      throw new NotFoundError();
    }
    if (extractSingleMongoId(progress.user) !== extractSingleMongoId(currentUser)) {
      throw new ForbiddenError();
    }

    const unit: IUnitModel = await Unit.findById(progress.unit);
    const course = await Course.findById(unit._course);
    if (!course.checkPrivileges(currentUser).userCanViewCourse) {
      throw new ForbiddenError();
    }
    ProgressController.checkDeadline(unit);

    // set user
    data.user = currentUser._id;

    progress.set(data);
    await progress.save();

    return progress.toObject();
  }
}
