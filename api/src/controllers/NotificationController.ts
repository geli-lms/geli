import {Get, Post, Delete, Param, BodyParam, CurrentUser, Authorized,
        UseBefore, JsonController, BadRequestError, ForbiddenError, NotFoundError, InternalServerError} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {NotificationSettings, API_NOTIFICATION_TYPE_ALL_CHANGES} from '../models/NotificationSettings';
import {Notification} from '../models/Notification';
import {Course, ICourseModel} from '../models/Course';
import {Lecture, ILectureModel} from '../models/Lecture';
import {Unit, IUnitModel} from '../models/units/Unit';
import {User} from '../models/User';
import {ICourse} from '../../../shared/models/ICourse';
import {ILecture} from '../../../shared/models/ILecture';
import {IUnit} from '../../../shared/models/units/IUnit';
import {IUser} from '../../../shared/models/IUser';
import {SendMailOptions} from 'nodemailer';
import emailService from '../services/EmailService';
import {errorCodes} from '../config/errorCodes';

@JsonController('/notification')
@UseBefore(passportJwtMiddleware)
export class NotificationController {

  static async resolveTarget(targetId: string, targetType: string, currentUser: IUser) {
    let course: ICourseModel;
    let lecture: ILectureModel;
    let unit: IUnitModel;
    switch (targetType) {
      case 'course':
        course = await Course.findById(targetId).orFail(new NotFoundError());
        break;
      case 'lecture':
        lecture = await Lecture.findById(targetId).orFail(new NotFoundError());
        course = await Course.findOne({lectures: targetId})
          .orFail(new InternalServerError(errorCodes.notification.missingCourseOfLecture.text));
        break;
      case 'unit':
        unit = await Unit.findById(targetId).orFail(new NotFoundError());
        course = await Course.findById(unit._course)
          .orFail(new InternalServerError(errorCodes.notification.missingCourseOfUnit.text));
        break;
      default:
        throw new BadRequestError(errorCodes.notification.invalidTargetType.text);
    }
    if (!course.checkPrivileges(currentUser).userCanEditCourse) {
      throw new ForbiddenError();
    }
    return {course, lecture, unit};
  }

  /**
   * @api {post} /api/notification/ Create notifications
   * @apiName PostNotifications
   * @apiGroup Notification
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {String} targetId Target id of the changed course, lecture or unit.
   * @apiParam {String} targetType Which type the targetId represents: Either 'course', 'lecture' or 'unit'.
   * @apiParam {String} text Message that the new notification(s) will contain.
   *
   * @apiSuccess {Object} result Empty object.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {}
   *
   * @apiError NotFoundError Did not find the targetId of targetType.
   * @apiError BadRequestError Invalid targetType.
   * @apiError ForbiddenError The teacher doen't have access to the corresponding course.
   * @apiError InternalServerError No course was found for a given existing lecture.
   * @apiError InternalServerError No course was found for a given existing unit.
   */
  @Authorized(['teacher', 'admin'])
  @Post('/')
  async createNotifications(@BodyParam('targetId', {required: true}) targetId: string,
                            @BodyParam('targetType', {required: true}) targetType: string,
                            @BodyParam('text', {required: true}) text: string,
                            @CurrentUser() currentUser: IUser) {
    const {course, lecture, unit} = await NotificationController.resolveTarget(targetId, targetType, currentUser);
    await Promise.all(course.students.map(async student => {
      if (await this.shouldCreateNotification(student, course, unit)) {
        await this.createNotification(student, text, course, lecture, unit);
      }
    }));
    return {};
  }

  /**
   * @api {post} /api/notification/user/:id Create notification for user
   * @apiName PostNotification
   * @apiGroup Notification
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {String} id ID of the user that the new notification is assigned/sent to.
   * @apiParam {String} targetId Target id of the changed course, lecture or unit.
   * @apiParam {String} targetType Which type the targetId represents: Either 'course', 'lecture', 'unit' or 'text'.
   *                               The 'text' type only uses the 'text' parameter while ignoring the 'targetId'.
   * @apiParam {String} text Message that the new notification(s) will contain.
   *
   * @apiSuccess {Object} result Empty object.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {}
   *
   * @apiError NotFoundError Did not find the targetId of targetType.
   * @apiError BadRequestError Invalid targetType.
   * @apiError ForbiddenError The teacher doen't have access to the corresponding course (if targetType isn't 'text'-only).
   * @apiError InternalServerError No course was found for a given existing lecture.
   * @apiError InternalServerError No course was found for a given existing unit.
   */
  @Authorized(['teacher', 'admin'])
  @Post('/user/:id')
  async createNotificationForStudent(@Param('id') userId: string,
                                    @BodyParam('targetId', {required: false}) targetId: string,
                                    @BodyParam('targetType', {required: true}) targetType: string,
                                    @BodyParam('text', {required: false}) text: string,
                                    @CurrentUser() currentUser: IUser) {
    if (targetType === 'text' && !text) {
      throw new BadRequestError(errorCodes.notification.textOnlyWithoutText.text);
    }
    const {course, lecture, unit} = targetType === 'text'
      ? {course: undefined, lecture: undefined, unit: undefined}
      : await NotificationController.resolveTarget(targetId, targetType, currentUser);

    const user = await User.findById(userId).orFail(new NotFoundError(errorCodes.notification.targetUserNotFound.text));

    if (await this.shouldCreateNotification(user, course, unit)) {
      await this.createNotification(user, text, course, lecture, unit);
    }
    return {};
  }

  async shouldCreateNotification(user: IUser, changedCourse: ICourseModel, changedUnit?: IUnitModel) {
    if (!changedCourse && !changedUnit) {
      // The notificaiton does not depend on any unit/course. We can create a notification.
      return true;
    }
    if (!changedUnit) {
      return !(await Notification.findOne({user, changedCourse}));
    }
    return !(await Notification.findOne({user, changedUnit}));
  }

  async createNotification(user: IUser, text: string, changedCourse?: ICourse, changedLecture?: ILecture, changedUnit?: IUnit) {
    // create no notification if course is not active
    if (changedCourse && !changedCourse.active) {
      return;
    }
    // create no notification for unit if unit is invisible
    if (changedUnit && !changedUnit.visible) {
      return;
    }
    const notification = new Notification();
    notification.user = user;
    notification.text = text;
    notification.isOld = false;
    if (changedCourse) {
      notification.changedCourse = changedCourse;
      const settings = await this.getOrCreateSettings(user, changedCourse);
      if (settings.notificationType === API_NOTIFICATION_TYPE_ALL_CHANGES) {
        if (changedLecture) {
          notification.changedLecture = changedLecture;
        }
        if (changedUnit) {
          notification.changedUnit = changedUnit;
        }
        if (settings.emailNotification) {
          await this.sendNotificationMail(user, 'you received new notifications for the course ' + changedCourse.name + '.');
        }
      }
    }
    return await notification.save();
  }

  async getOrCreateSettings(user: IUser, changedCourse: ICourse) {
    let settings = await NotificationSettings.findOne({'user': user, 'course': changedCourse});
    if (settings === undefined || settings === null) {
      settings = await new NotificationSettings({
        user: user,
        course: changedCourse,
        notificationType: API_NOTIFICATION_TYPE_ALL_CHANGES,
        emailNotification: false
      }).save();
    }
    return settings;
  }

  async sendNotificationMail(user: IUser, text: string) {
    const message: SendMailOptions = {};
    user = await User.findById(user);
    message.to = user.profile.firstName + ' ' + user.profile.lastName + '<' + user.email + '>';
    message.subject = 'Geli informs: you have new notifications :)';
    message.text = 'Hello ' + user.profile.firstName + ', \n\n' +
      +text + '\n' + 'Please check your notifications in geli.\n' +
      'Your GELI Team.';
    message.html = '<p>Hello ' + user.profile.firstName + ',</p><br>' +
      '<p>' + text + '<br>Please check your notifications in geli.</p><br>' +
      '<p>Your GELI Team.</p>';
    await emailService.sendFreeFormMail(message);
  }

  /**
   * @api {get} /api/notification/ Get own notifications
   * @apiName GetNotifications
   * @apiGroup Notification
   * @apiPermission student
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiSuccess {INotificationView[]} notifications List of notifications.
   *
   * @apiSuccessExample {json} Success-Response:
   *     [{
   *         "_id": "5ab2fbe464efe60006cef0b1",
   *         "changedCourse": "5c0fb47d8d583532143c68a7",
   *         "changedLecture": "5bdb49f11a09bb3ca8ce0a10",
   *         "changedUnit": "5be0691ee3859d38308dab18",
   *         "text": "Course ProblemSolver has an updated text unit.",
   *         "isOld": false
   *     }, {
   *         "_id": "5ab2fc7b64efe60006cef0bb",
   *         "changedCourse": "5be0691ee3859d38308dab19",
   *         "changedLecture": "5bdb49ef1a09bb3ca8ce0a01",
   *         "changedUnit": "5bdb49f11a09bb3ca8ce0a12",
   *         "text": "Course katacourse has an updated unit.",
   *         "isOld": false
   *     }]
   */
  @Authorized(['student', 'teacher', 'admin'])
  @Get('/')
  async getNotifications(@CurrentUser() currentUser: IUser) {
    const notifications = await Notification.find({user: currentUser});
    return notifications.map(notification => notification.forView());
  }

  /**
   * @api {delete} /api/notification/:id Delete notification
   * @apiName DeleteNotification
   * @apiGroup Notification
   * @apiPermission student
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {String} id Notification ID.
   *
   * @apiSuccess {Object} result Empty object.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {}
   *
   * @apiError NotFoundError Notification could not be found.
   */
  @Authorized(['student', 'teacher', 'admin'])
  @Delete('/:id')
  async deleteNotification(@Param('id') id: string, @CurrentUser() currentUser: IUser) {
    const notification = await Notification.findOne({_id: id, user: currentUser}).orFail(new NotFoundError());
    await notification.remove();
    return {};
  }
}
