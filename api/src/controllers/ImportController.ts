import {Authorized, CurrentUser, JsonController, Param, Post, UploadedFile, UseBefore} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {Course} from '../models/Course';
import {Lecture} from '../models/Lecture';
import {Unit} from '../models/units/Unit';
import {IUser} from '../../../shared/models/IUser';

@JsonController('/import')
@UseBefore(passportJwtMiddleware)
@Authorized(['teacher', 'admin'])
export class ImportController {

  /**
   * @api {post} /api/import/course Import course
   * @apiName PostImportCourse
   * @apiGroup Import
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {Object} file Uploaded file.
   * @apiParam {IUser} currentUser Currently logged in user.
   *
   * @apiSuccess {Course} course Imported course.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "_id": "5ab2518b6a53b2463c44ef29",
   *         "updatedAt": "2018-03-21T12:35:23.812Z",
   *         "createdAt": "2018-03-21T12:35:23.803Z",
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
   */
  @Post('/course')
  async importCourse(@UploadedFile('file') file: any,
                     @CurrentUser() user: IUser) {
    const courseDesc = JSON.parse(file.buffer.toString());
    return await Course.schema.statics.importJSON(courseDesc, user);
  }

  /**
   * @api {post} /api/import/lecture/:course Import lecture
   * @apiName PostImportLecture
   * @apiGroup Import
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {Object} file Uploaded file.
   * @apiParam {String} courseId Course ID.
   *
   * @apiSuccess {Lecture} lecture Imported lecture.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "_id": "5ab25342579fd5301c34e62f",
   *         "updatedAt": "2018-03-21T12:42:42.392Z",
   *         "createdAt": "2018-03-21T12:42:42.392Z",
   *         "name": "Lecture One",
   *         "description": "Some lecture desc",
   *         "__v": 0,
   *         "units": []
   *     }
   */
  @Post('/lecture/:course')
  async importLecture(@UploadedFile('file') file: any,
                      @Param('course') courseId: string) {
    const lectureDesc = JSON.parse(file.buffer.toString());
    return Lecture.schema.statics.importJSON(lectureDesc, courseId);
  }

  /**
   * @api {post} /api/import/unit/:course/:lecture Import unit
   * @apiName PostImportUnit
   * @apiGroup Import
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {Object} file Uploaded file.
   * @apiParam {String} courseId Course ID.
   * @apiParam {String} lectureId Lecture ID.
   *
   * @apiSuccess {Unit} unit Imported unit.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "__v": 0,
   *         "updatedAt": "2018-03-21T12:50:36.628Z",
   *         "createdAt": "2018-03-21T12:50:36.628Z",
   *         "progressable": false,
   *         "weight": 0,
   *         "name": "First unit",
   *         "description": null,
   *         "markdown": "Welcome, this is the start",
   *         "_course": "5ab2518b6a53b2463c44ef29",
   *         "__t": "free-text",
   *         "_id": "5ab2551c85b1ca402815e0b9"
   *     }
   */
  @Post('/unit/:course/:lecture')
  async importUnit(@UploadedFile('file') file: any,
                   @Param('course') courseId: string,
                   @Param('lecture') lectureId: string) {
    const unitDesc = JSON.parse(file.buffer.toString());
    return Unit.schema.statics.importJSON(unitDesc, courseId, lectureId);
  }
}
