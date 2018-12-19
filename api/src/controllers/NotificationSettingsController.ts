import {Authorized, BadRequestError, Body, Get, JsonController, Param, Post, Put, UseBefore, CurrentUser} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {
  API_NOTIFICATION_TYPE_ALL_CHANGES,
  INotificationSettingsModel,
  NotificationSettings
} from '../models/NotificationSettings';
import {INotificationSettingsView} from '../../../shared/models/INotificationSettingsView';
import {IUser} from '../../../shared/models/IUser';

@JsonController('/notificationSettings')
@UseBefore(passportJwtMiddleware)
export class NotificationSettingsController {

  /**
   * @api {get} /api/notificationSettings/ Get own notification settings
   * @apiName GetNotificationSettings
   * @apiGroup NotificationSettings
   * @apiPermission student
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiSuccess {INotificationSettingsView[]} settings List of notification settings.
   *
   * @apiSuccessExample {json} Success-Response:
   *     [{
   *         "_id": "5ab2829142949f000857b8f8",
   *         "course": "5be0691ee3859d38308dab19",
   *         "notificationType": "allChanges",
   *         "emailNotification": false
   *     }, {
   *         "_id": "5ab283b342949f000857b8f9",
   *         "course": "5c0fb47d8d583532143c68a7",
   *         "notificationType": "relatedChanges",
   *         "emailNotification": true
   *     }]
   */
  @Authorized(['student', 'teacher', 'admin'])
  @Get('/')
  async getNotificationSettings(@CurrentUser() currentUser: IUser) {
    const notificationSettings = await NotificationSettings.find({user: currentUser})
      .populate('user')
      .populate('course');
    return notificationSettings.map(settings => settings.forView());
  }

  /**
   * @api {put} /api/notificationSettings/user/:id Update notification settings
   * @apiName PutNotificationSettings
   * @apiGroup NotificationSettings
   * @apiPermission student
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {String} id ID of notification settings.
   * @apiParam {INotificationSettingsView} notificationSettings New notification settings.
   *
   * @apiSuccess {INotificationSettingsView} settings Updated notification settings.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "_id": "5ab2829142949f000857b8f8",
   *         "course": "5be0691ee3859d38308dab19",
   *         "notificationType": "allChanges",
   *         "emailNotification": false
   *     }
   *
   * @apiError BadRequestError notification needs fields course and user
   */
  @Authorized(['student', 'teacher', 'admin'])
  @Put('/:id')
  async updateNotificationSettings(@Param('id') id: string,
                                  @Body() notificationSettings: INotificationSettingsView,
                                  @CurrentUser() currentUser: IUser) {
    if (!notificationSettings.course) {
      throw new BadRequestError('Notification settings request needs course field');
    }
    const settings: INotificationSettingsModel =
      await NotificationSettings.findOneAndUpdate({'_id': id}, {...notificationSettings, user: currentUser._id}, {new: true});
    return settings.forView();
  }

  /**
   * @api {post} /api/notificationSettings/ Create notification settings
   * @apiName PostNotificationSettings
   * @apiGroup NotificationSettings
   * @apiPermission student
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {Object} data Data for new notification settings.
   *
   * @apiSuccess {INotificationSettingsView} settings Created notification settings.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "_id": "5ab2829142949f000857b8f8",
   *         "course": "5be0691ee3859d38308dab19",
   *         "notificationType": "allChanges",
   *         "emailNotification": false
   *     }
   *
   * @apiError BadRequestError NotificationSettings need course and user
   * @apiError BadRequestError NotificationSettings for user: x with course: y already exist
   */
  @Authorized(['student', 'teacher', 'admin'])
  @Post('/')
  async createNotificationSettings(@Body() data: any) {
    if (!data.user || !data.course) {
      throw new BadRequestError('NotificationSettings need course and user');
    }
    const notificationSettings: INotificationSettingsModel =
      await NotificationSettings.findOne({'user': data.user, 'course': data.course});
    if (notificationSettings) {
      throw new BadRequestError('NotificationSettings for user:' + data.user + ' with course: ' + data.course + ' already exist');
    }
    const settings: INotificationSettingsModel = await new NotificationSettings({
      'user': data.user,
      'course': data.course,
      'notificationType': API_NOTIFICATION_TYPE_ALL_CHANGES,
      'emailNotification': false
    }).save();
    return settings.forView();
  }


}
