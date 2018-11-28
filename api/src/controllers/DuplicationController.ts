import {
  BodyParam, Post, Param, JsonController, UseBefore, Authorized, CurrentUser,
  ForbiddenError, NotFoundError
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

  private static async assertUserDuplicationAuthorization(user: IUser, course: ICourseModel) {
    if (!course.checkPrivileges(user).userCanEditCourse) {
      throw new ForbiddenError();
    }
  }

  private static extractCommonResponse(duplicate: ICourse | ILecture | IUnit): IDuplicationResponse {
    return {_id: extractSingleMongoId(duplicate)};
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
   * @apiError NotFoundError If the course couldn't be found.
   * @apiError ForbiddenError assertUserDuplicationAuthorization check failed.
   */
  @Post('/course/:id')
  async duplicateCourse(@Param('id') id: string,
                        @BodyParam('courseAdmin', {required: false}) newCourseAdminId: string,
                        @CurrentUser() currentUser: IUser) {
    const courseModel: ICourseModel = await Course.findById(id);
    if (!courseModel) { throw new NotFoundError(); }
    await DuplicationController.assertUserDuplicationAuthorization(currentUser, courseModel);

    // Set the currentUser's id as newCourseAdminId if it wasn't specified by the request.
    newCourseAdminId = typeof newCourseAdminId === 'string' ? newCourseAdminId : extractSingleMongoId(currentUser);

    const exportedCourse: ICourse = await courseModel.exportJSON(false);
    delete exportedCourse.students;
    const duplicate = await Course.schema.statics.importJSON(exportedCourse, newCourseAdminId);
    return DuplicationController.extractCommonResponse(duplicate);
  }

  /**
   * @api {post} /api/duplicate/lecture/:id Duplicate lecture
   * @apiName PostDuplicateLecture
   * @apiGroup Duplication
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {String} id Lecture ID.
   * @apiParam {Object} data Object with target courseId (the lecture duplicate will be attached to this course).
   *
   * @apiSuccess {Lecture} lecture Duplicated lecture ID.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "_id": "5ab1a218dab93c34f8541e25"
   *     }
   *
   * @apiError NotFoundError If the lecture or the target courseId couldn't be found.
   * @apiError ForbiddenError assertUserDuplicationAuthorization check failed.
   */
  @Post('/lecture/:id')
  async duplicateLecture(@Param('id') id: string,
                         @BodyParam('courseId', {required: true}) targetCourseId: string,
                         @CurrentUser() currentUser: IUser) {
    const course = await Course.findOne({lectures: id});
    if (!course) { throw new NotFoundError(); }
    await DuplicationController.assertUserDuplicationAuthorization(currentUser, course);
    const targetCourse = await Course.findById(targetCourseId);
    if (!targetCourse) { throw new NotFoundError(errorCodes.duplication.targetNotFound.text); }
    await DuplicationController.assertUserDuplicationAuthorization(currentUser, targetCourse);

    const lectureModel: ILectureModel = await Lecture.findById(id);
    const exportedLecture: ILecture = await lectureModel.exportJSON();
    const duplicate = await Lecture.schema.statics.importJSON(exportedLecture, targetCourseId);
    return DuplicationController.extractCommonResponse(duplicate);
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
   * @apiError NotFoundError If the unit or the target lectureId couldn't be found.
   * @apiError ForbiddenError assertUserDuplicationAuthorization check failed.
   */
  @Post('/unit/:id')
  async duplicateUnit(@Param('id') id: string,
                      @BodyParam('lectureId', {required: true}) targetLectureId: string,
                      @CurrentUser() currentUser: IUser) {
    const unitModel: IUnitModel = await Unit.findById(id);
    if (!unitModel) { throw new NotFoundError(); }
    const course = await Course.findById(unitModel._course);
    await DuplicationController.assertUserDuplicationAuthorization(currentUser, course);
    const targetCourse = await Course.findOne({lectures: targetLectureId});
    if (!targetCourse) { throw new NotFoundError(errorCodes.duplication.targetNotFound.text); }
    await DuplicationController.assertUserDuplicationAuthorization(currentUser, targetCourse);
    const targetCourseId = extractSingleMongoId(targetCourse);

    const exportedUnit: IUnit = await unitModel.exportJSON();
    const duplicate = await Unit.schema.statics.importJSON(exportedUnit, targetCourseId, targetLectureId);
    return DuplicationController.extractCommonResponse(duplicate);
  }

}
