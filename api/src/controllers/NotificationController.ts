import {Get, Post, Delete, Param, Body, CurrentUser, Authorized,
        UseBefore, BadRequestError, JsonController, NotFoundError} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {NotificationSettings, API_NOTIFICATION_TYPE_ALL_CHANGES} from '../models/NotificationSettings';
import {Notification} from '../models/Notification';
import {Course} from '../models/Course';
import {User} from '../models/User';
import {IUser} from '../../../shared/models/IUser';
import {ICourse} from '../../../shared/models/ICourse';
import {ILecture} from '../../../shared/models/ILecture';
import {IUnit} from '../../../shared/models/units/IUnit';
import {SendMailOptions} from 'nodemailer';
import emailService from '../services/EmailService';

@JsonController('/notification')
@UseBefore(passportJwtMiddleware)
export class NotificationController {


  /**
   * @api {post} /api/notification/ Create notifications
   * @apiName PostNotifications
   * @apiGroup Notification
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {Object} data Notification text and information on changed course, lecture and unit.
   *
   * @apiSuccess {Boolean} notified Confirmation of notification.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         notified: true
   *     }
   *
   * @apiError BadRequestError Notification needs at least the fields course and text
   * @apiError InternalServerError Failed to create notification
   */
  @Authorized(['teacher', 'admin'])
  @Post('/')
  async createNotifications(@Body() data: any) {
    if (!data.changedCourse || !data.text) {
      throw new BadRequestError('Notification needs at least the fields course and text');
    }
    const course = await Course.findById(data.changedCourse._id);
    await Promise.all(course.students.map(async student => {
      if (await this.shouldCreateNotification(student, data.changedCourse, data.changedUnit)) {
        await this.createNotification(student, data.text, data.changedCourse, data.changedLecture, data.changedUnit);
      }
    }));
    return {notified: true};
  }

  /**
   * @api {post} /api/notification/user/:id Create notification for user
   * @apiName PostNotification
   * @apiGroup Notification
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {String} id User ID.
   * @apiParam {Object} data Notification text and information on changed course, lecture and unit.
   *
   * @apiSuccess {Boolean} notified Confirmation of notification.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         notified: true
   *     }
   *
   * @apiError InternalServerError Failed to create notification
   */
  @Authorized(['teacher', 'admin'])
  @Post('/user/:id')
  async createNotificationForStudent(@Param('id') userId: string, @Body() data: any) {
    if (!data.changedCourse && !data.text) {
      throw new BadRequestError('Notification needs at least the field changedCourse or text');
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new BadRequestError('Could not create notification because user not found');
    }
    if (await this.shouldCreateNotification(user, data.changedCourse, data.changedUnit)) {
      await this.createNotification(user, data.text, data.changedCourse, data.changedLecture, data.changedUnit);
    }
    return {notified: true};
  }

  async shouldCreateNotification(user: IUser, changedCourse: ICourse, changedUnit: IUnit = null) {
    if (!changedUnit) {
      return (await Notification.count({'user': user._id, 'changedCourse': changedCourse._id})) === 0;
    }
    return (await Notification.count({'user': user._id, 'changedUnit': changedUnit._id})) === 0;
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
   * @api {get} /api/notification/user/:id Get notifications
   * @apiName GetNotification
   * @apiGroup Notification
   * @apiPermission student
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {String} id User ID.
   *
   * @apiSuccess {Notification[]} notifications List of notifications.
   *
   * @apiSuccessExample {json} Success-Response:
   *     [{
   *         "_id": "5ab2fbe464efe60006cef0b1",
   *         "updatedAt": "2018-03-22T00:42:12.577Z",
   *         "createdAt": "2018-03-22T00:42:12.577Z",
   *         "changedUnit": {...},
   *         "changedLecture": {...},
   *         "changedCourse": {...},
   *         "isOld": false,
   *         "text": "Course ProblemSolver has an updated text unit.",
   *         "user": {...},
   *         "__v": 0
   *     }, {
   *         "_id": "5ab2fc7b64efe60006cef0bb",
   *         "updatedAt": "2018-03-22T00:44:43.966Z",
   *         "createdAt": "2018-03-22T00:44:43.966Z",
   *         "changedUnit": {...},
   *         "changedLecture": {...},
   *         "changedCourse": {...},
   *         "isOld": false,
   *         "text": "Course katacourse has an updated unit.",
   *         "user": {...},
   *         "__v": 0
   *     }]
   */
  @Authorized(['student', 'teacher', 'admin'])
  @Get('/user/:id')
  async getNotifications(@Param('id') id: string) {
    const notifications = await Notification.find({'user': id})
      .populate('user')
      .populate('changedCourse')
      .populate('changedLecture')
      .populate('changedUnit');
    return notifications.map(notification => {
      return notification.toObject();
    });

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
   * @apiParam {IUser} currentUser Currently logged in user.
   *
   * @apiSuccess {Object} deletion Object with deleted notification.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "$__": {...},
   *         "isNew": false,
   *         "_doc": {
   *             "__v": 0,
   *             "user": {...},
   *             "text": "Course ProblemSolver has an updated text unit.",
   *             "isOld": false,
   *             "changedCourse": {...},
   *             "changedLecture": {...},
   *             "changedUnit": {...},
   *             "createdAt": "2018-03-22T00:42:12.577Z",
   *             "updatedAt": "2018-03-22T00:42:12.577Z",
   *             "_id": {...}
   *         },
   *         "$init": true
   *     }
   *
   * @apiError NotFoundError Notification could not be found.
   */
  @Authorized(['student', 'teacher', 'admin'])
  @Delete('/:id')
  async deleteNotification(@Param('id') id: string, @CurrentUser() currentUser: IUser) {
    const notification = await Notification.findOne({_id: id, user: currentUser});
    if (!notification) {
      throw new NotFoundError('Notification could not be found.');
    }
    return notification.remove();
  }
}
