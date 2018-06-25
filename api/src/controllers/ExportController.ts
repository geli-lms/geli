import {Authorized, CurrentUser, Get, JsonController, NotFoundError, Param, Res, UseBefore} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {Course, ICourseModel} from '../models/Course';
import {Lecture} from '../models/Lecture';
import {Unit} from '../models/units/Unit';
import {IUser} from '../../../shared/models/IUser';
import {User} from '../models/User';
import {Notification} from '../models/Notification';
import {NotificationSettings} from '../models/NotificationSettings';
import {WhitelistUser} from '../models/WhitelistUser';
import {IProgressModel, Progress} from '../models/progress/Progress';
import {ITaskUnitProgressModel} from '../models/progress/TaskUnitProgress';
import {Response} from 'express';

@JsonController('/export')
@UseBefore(passportJwtMiddleware)
@Authorized(['teacher', 'admin'])
export class ExportController {

  /**
   * @api {get} /api/export/course/:id Export course
   * @apiName GetExportCourse
   * @apiGroup Export
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {String} id Course ID.
   *
   * @apiSuccess {Course} course Course for export.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "name": "Test 101",
   *         "description": "Some course desc",
   *         "enrollType": "whitelist",
   *         "lectures": [{
   *             "name": "Lecture One",
   *             "description": "Some lecture desc",
   *             "units": []
   *         }],
   *         "hasAccessKey": false
   *     }
   */
  @Get('/course/:id')
  async exportCourse(@Param('id') id: string) {
    const course = await Course.findById(id);
    return course.exportJSON();
  }

  /**
   * @api {get} /api/export/lecture/:id Export lecture
   * @apiName GetExportLecture
   * @apiGroup Export
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {String} id Lecture ID.
   *
   * @apiSuccess {Lecture} lecture Lecture for export.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "name": "Lecture One",
   *         "description": "Some lecture desc",
   *         "units": []
   *     }
   */
  @Get('/lecture/:id')
  async exportLecture(@Param('id') id: string) {
    const lecture = await Lecture.findById(id);
    return lecture.exportJSON();
  }

  /**
   * @api {get} /api/export/unit/:id Export unit
   * @apiName GetExportUnit
   * @apiGroup Export
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {String} id Unit ID.
   *
   * @apiSuccess {Unit} unit Unit for export.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "progressable": false,
   *         "weight": 0,
   *         "name": "First unit",
   *         "description": null,
   *         "markdown": "Welcome, this is the start",
   *         "__t": "free-text"
   *     }
   */
  @Get('/unit/:id')
  async exportUnit(@Param('id') id: string) {
    const unit = await Unit.findById(id);
    return unit.exportJSON();
  }

  @Get('/user')
  @Authorized(['student', 'teacher', 'admin'])
  async exportAllUserData(@CurrentUser() currentUser: IUser,  @Res() response: Response) {
    // load user
    const user = await User.findById(currentUser);

    return {
      user: await user.exportPersonalData(),
      notifications: await Notification.exportPersonalData(user),
      notificationSettings: await NotificationSettings.exportPersonalData(user),
      whitelists: await WhitelistUser.exportPersonalData(user),
      courses: await Course.exportPersonalData(user),
      progress: await Progress.exportPersonalUserData(user)
    };
  }
}
