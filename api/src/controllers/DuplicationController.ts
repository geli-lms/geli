import {
  BodyParam, Post, Param, JsonController, UseBefore, Authorized, CurrentUser,
  InternalServerError, ForbiddenError
} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {IUser} from '../../../shared/models/IUser';
import {IUnit} from '../../../shared/models/units/IUnit';
import {ILectureModel, Lecture} from '../models/Lecture';
import {IUnitModel, Unit} from '../models/units/Unit';
import {Course, ICourseModel} from '../models/Course';
import {ILecture} from '../../../shared/models/ILecture';
import {ICourse} from '../../../shared/models/ICourse';
import {IDuplicationResponse} from '../../../shared/models/IDuplicationResponse';
import {extractSingleMongoId} from '../utilities/ExtractMongoId';
import {errorCodes} from '../config/errorCodes';


@JsonController('/duplicate')
@UseBefore(passportJwtMiddleware)
@Authorized(['teacher', 'admin'])
export class DuplicationController {

  private async assertUserDuplicationAuthorization(user: IUser, course: ICourseModel) {
    if (!course.checkPrivileges(user).userCanEditCourse) {
      throw new ForbiddenError();
    }
  }

  private extractCommonResponse(duplicate: ICourse | ILecture | IUnit): IDuplicationResponse {
    return {_id: extractSingleMongoId(duplicate)};
  }

  private rethrowAsInternalServerError(err: any, message: string) {
    // TODO This is older code that was factored out here; maybe the route error handling can be reduced or improved further?
    const newError = new InternalServerError(message);
    newError.stack += '\nCaused by: ' + err.message + '\n' + err.stack;
    throw newError;
  }

  /**
   * @api {post} /api/duplicate/course/:id Duplicate course
   * @apiName PostDuplicateCourse
   * @apiGroup Duplication
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {String} id Course ID.
   * @apiParam {Object} data Object optionally containing the courseAdmin id for the duplicated course as "courseAdmin".
   *                    If unset, the currentUser will be set as courseAdmin.
   *
   * @apiSuccess {Course} course Duplicated course ID.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "_id": "5ab19c382ac32e46dcaa1574"
   *     }
   *
   * @apiError InternalServerError Failed to duplicate course
   */
  @Post('/course/:id')
  async duplicateCourse(@Param('id') id: string,
                        @BodyParam('courseAdmin', {required: false}) newCourseAdminId: string,
                        @CurrentUser() currentUser: IUser) {
    const courseModel: ICourseModel = await Course.findById(id);
    await this.assertUserDuplicationAuthorization(currentUser, courseModel);
    try {
      // Set the currentUser's id as newCourseAdminId if it wasn't specified by the request.
      newCourseAdminId = typeof newCourseAdminId === 'string' ? newCourseAdminId : extractSingleMongoId(currentUser);

      const exportedCourse: ICourse = await courseModel.exportJSON(false);
      delete exportedCourse.students;
      const duplicate = await Course.schema.statics.importJSON(exportedCourse, newCourseAdminId);
      return this.extractCommonResponse(duplicate);
    } catch (err) {
      this.rethrowAsInternalServerError(err, errorCodes.duplication.courseDuplicationFailed.text);
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
   * @apiSuccess {Lecture} lecture Duplicated lecture ID.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "_id": "5ab1a218dab93c34f8541e25"
   *     }
   *
   * @apiError InternalServerError Failed to duplicate lecture
   */
  @Post('/lecture/:id')
  async duplicateLecture(@Param('id') id: string,
                         @BodyParam('courseId', {required: true}) targetCourseId: string,
                         @CurrentUser() currentUser: IUser) {
    const course = await Course.findOne({lectures: id});
    await this.assertUserDuplicationAuthorization(currentUser, course);
    const targetCourse = await Course.findById(targetCourseId);
    await this.assertUserDuplicationAuthorization(currentUser, targetCourse);
    try {
      const lectureModel: ILectureModel = await Lecture.findById(id);
      const exportedLecture: ILecture = await lectureModel.exportJSON();
      const duplicate = await Lecture.schema.statics.importJSON(exportedLecture, targetCourseId);
      return this.extractCommonResponse(duplicate);
    } catch (err) {
      this.rethrowAsInternalServerError(err, errorCodes.duplication.lectureDuplicationFailed.text);
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
   * @apiParam {Object} data Object with target lectureId (the unit duplicate will be attached to this lecture).
   *
   * @apiSuccess {Unit} unit Duplicated unit ID.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "_id": "5ab1a380f5bbeb423070d787"
   *     }
   *
   * @apiError InternalServerError Failed to duplicate unit
   */
  @Post('/unit/:id')
  async duplicateUnit(@Param('id') id: string,
                      @BodyParam('lectureId', {required: true}) targetLectureId: string,
                      @CurrentUser() currentUser: IUser) {
    const unitModel: IUnitModel = await Unit.findById(id);
    const course = await Course.findById(unitModel._course);
    await this.assertUserDuplicationAuthorization(currentUser, course);
    const targetCourse = await Course.findOne({lectures: targetLectureId});
    await this.assertUserDuplicationAuthorization(currentUser, targetCourse);
    const targetCourseId = extractSingleMongoId(targetCourse);
    try {
      const exportedUnit: IUnit = await unitModel.exportJSON();
      const duplicate = await Unit.schema.statics.importJSON(exportedUnit, targetCourseId, targetLectureId);
      return this.extractCommonResponse(duplicate);
    } catch (err) {
      this.rethrowAsInternalServerError(err, errorCodes.duplication.unitDuplicationFailed.text);
    }
  }

}
