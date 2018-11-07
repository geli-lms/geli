import {
  Body, Post, Param, JsonController, UseBefore, Authorized, InternalServerError
} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {IUnit} from '../../../shared/models/units/IUnit';
import {ILectureModel, Lecture} from '../models/Lecture';
import {IUnitModel, Unit} from '../models/units/Unit';
import {Course, ICourseModel} from '../models/Course';
import {ILecture} from '../../../shared/models/ILecture';
import {ICourse} from '../../../shared/models/ICourse';


@JsonController('/duplicate')
@UseBefore(passportJwtMiddleware)
@Authorized(['teacher', 'admin'])
export class DuplicationController {

  /**
   * @api {post} /api/duplicate/course/:id Duplicate course
   * @apiName PostDuplicateCourse
   * @apiGroup Duplication
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {String} id Course ID.
   * @apiParam {Object} data Course data (with courseAdmin).
   *
   * @apiSuccess {Course} course Duplicated course.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "_id": "5ab19c382ac32e46dcaa1574",
   *         "updatedAt": "2018-03-20T23:41:44.792Z",
   *         "createdAt": "2018-03-20T23:41:44.773Z",
   *         "name": "Test 101 (copy)",
   *         "description": "Some course desc",
   *         "courseAdmin": "5a037e6a60f72236d8e7c813",
   *         "active": false,
   *         "__v": 1,
   *         "whitelist": [],
   *         "enrollType": "whitelist",
   *         "lectures": [...],
   *         "students": [],
   *         "teachers": [],
   *         "hasAccessKey": false
   *     }
   *
   * @apiError InternalServerError Failed to duplicate course
   */
  @Post('/course/:id')
  async duplicateCourse(@Param('id') id: string, @Body() data: any) {
    // we could use @CurrentUser instead of the need to explicitly provide a teacher
    const courseAdmin = data.courseAdmin;
    try {
      const courseModel: ICourseModel = await Course.findById(id);
      const exportedCourse: ICourse = await courseModel.exportJSON(false);
      delete exportedCourse.students;
      return Course.schema.statics.importJSON(exportedCourse, courseAdmin);
    } catch (err) {
        const newError = new InternalServerError('Failed to duplicate course');
        newError.stack += '\nCaused by: ' + err.message + '\n' + err.stack;
        throw newError;
    }
  }

  /**
   * @api {post} /api/duplicate/lecture/:id Duplicate lecture
   * @apiName PostDuplicateLecture
   * @apiGroup Duplication
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {String} id Lecture ID.
   * @apiParam {Object} data Lecture data (with courseId).
   *
   * @apiSuccess {Lecture} lecture Duplicated lecture.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "_id": "5ab1a218dab93c34f8541e25",
   *         "updatedAt": "2018-03-21T00:06:48.043Z",
   *         "createdAt": "2018-03-21T00:06:48.043Z",
   *         "name": "Lecture One",
   *         "description": "Some lecture desc",
   *         "__v": 0,
   *         "units": []
   *     }
   *
   * @apiError InternalServerError Failed to duplicate lecture
   */
  @Post('/lecture/:id')
  async duplicateLecture(@Param('id') id: string, @Body() data: any) {
    const courseId = data.courseId;
    try {
      const lectureModel: ILectureModel = await Lecture.findById(id);
      const exportedLecture: ILecture = await lectureModel.exportJSON();
      return Lecture.schema.statics.importJSON(exportedLecture, courseId);
    } catch (err) {
      const newError = new InternalServerError('Failed to duplicate lecture');
      newError.stack += '\nCaused by: ' + err.message + '\n' + err.stack;
      throw newError;
    }
  }

  /**
   * @api {post} /api/duplicate/unit/:id Duplicate unit
   * @apiName PostDuplicateUnit
   * @apiGroup Duplication
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {String} id Unit ID.
   * @apiParam {Object} data Unit data (with courseId and lectureId).
   *
   * @apiSuccess {Unit} unit Duplicated unit.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "__v": 0,
   *         "updatedAt": "2018-03-21T00:12:48.592Z",
   *         "createdAt": "2018-03-21T00:12:48.592Z",
   *         "progressable": false,
   *         "weight": 0,
   *         "name": "First unit",
   *         "description": null,
   *         "markdown": "Welcome, this is the start",
   *         "_course": "5ab19c382ac32e46dcaa1574",
   *         "__t": "free-text",
   *         "_id": "5ab1a380f5bbeb423070d787"
   *     }
   *
   * @apiError InternalServerError Failed to duplicate unit
   */
  @Post('/unit/:id')
  async duplicateUnit(@Param('id') id: string, @Body() data: any) {
    const courseId = data.courseId;
    const lectureId = data.lectureId;
    try {
      const unitModel: IUnitModel = await Unit.findById(id);
      const exportedUnit: IUnit = await unitModel.exportJSON();
      return Unit.schema.statics.importJSON(exportedUnit, courseId, lectureId);
    } catch (err) {
      const newError = new InternalServerError('Failed to duplicate unit');
      newError.stack += '\nCaused by: ' + err.message + '\n' + err.stack;
      throw newError;
    }
  }

}
