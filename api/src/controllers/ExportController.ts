import {Authorized, CurrentUser, Get, JsonController, NotFoundError, Param, UseBefore} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {Course, ICourseModel} from '../models/Course';
import {Lecture} from '../models/Lecture';
import {IUnitModel, Unit} from '../models/units/Unit';
import {IUser} from "../../../shared/models/IUser";
import {User} from "../models/User";
import {Notification} from "../models/Notification";
import {NotificationSettings} from "../models/NotificationSettings";
import {WhitelistUser} from "../models/WhitelistUser";
import {IProgressModel, Progress} from "../models/progress/Progress";

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
  async exportAllUserData(@CurrentUser() currentUser: IUser) {

    // load user
    const user = await User.findById(currentUser);

    if (!user) {
      throw new NotFoundError(`User was not found.`);
    }

    //load notification
    const notificationSettings = await NotificationSettings.findOne({'user': user._id}, 'course notificationType emailNotification')
      .populate('course', 'name description -_id');

    const notificatinSettingsJson = await notificationSettings.exportJSON();
    delete (<ICourseModel><any>notificatinSettingsJson.course).hasAccessKey;


    // load notifications
    const notifications = await Notification.find({'user': user._id})
    const notificationTexts:string[] = notifications.map(notification => {
      return notification.text;
    });

    // User in whitelists
    const whitelistUsers = await WhitelistUser.find({uid: user.uid},"courseId")
      .populate('courseId', 'name description -_id');

    const whitelistUsersForExport = await Promise.all(whitelistUsers.map(async (whitelist) => {
      const course:ICourseModel = <any>whitelist.courseId;
      return await course.exportJSON(true, true);
    }));


    // Courses
    const conditions: any = {};
    conditions.$or = [];
    conditions.$or.push({students: user._id});
    conditions.$or.push({teachers: user._id});
    conditions.$or.push({courseAdmin: user._id});

    const courses = await Course.find(conditions, 'name description -_id');
    const exportCourses = await Promise.all(courses.map(async (course:ICourseModel) => {
      return await course.exportJSON(true, true);
    }));



    // Progress
    const userProgress = await Progress.find({'user': user._id},"-user")
      .populate('course', "name description")
      .populate('unit',"name description -_id");

    const userProgressExport = await Promise.all(userProgress.map( async (prog:IProgressModel) => {
      let progExport = await prog.exportJSON();
      progExport.course = await (<ICourseModel>prog.course).exportJSON(true, true);
      progExport.unit = await (<IUnitModel>prog.unit).exportJSON(true);
      return progExport;
    }));





    return {
      user: user.exportPersonalDataJSON(),
      notifications: notificationTexts,
      notificationSettings:notificatinSettingsJson,
      whiteLists: whitelistUsersForExport,
      courses: exportCourses,
      progress: userProgressExport
    }
  }

}
