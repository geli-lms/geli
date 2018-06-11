import {Authorized, BadRequestError, Body, Get, JsonController, Param, Post, Put, UseBefore} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {
  API_NOTIFICATION_TYPE_ALL_CHANGES,
  INotificationSettingsModel,
  NotificationSettings
} from '../models/NotificationSettings';
import {INotificationSettings} from '../../../shared/models/INotificationSettings';

@JsonController('/notificationSettings')
@UseBefore(passportJwtMiddleware)
export class NotificationSettingsController {

  /**
   * @api {get} /api/notificationSettings/user/:id Get notification settings per user
   * @apiName GetNotificationSettings
   * @apiGroup NotificationSettings
   * @apiPermission student
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {String} id User ID.
   *
   * @apiSuccess {INotificationSettingsModel[]} settings List of notification settings.
   *
   * @apiSuccessExample {json} Success-Response:
   *     [{
   *         "_id": "5ab2829142949f000857b8f8",
   *         "updatedAt": "2018-03-21T16:04:33.335Z",
   *         "createdAt": "2018-03-21T16:04:33.335Z",
   *         "user": {...},
   *         "course": {...},
   *         "notificationType": "allChanges",
   *         "emailNotification": false,
   *         "__v": 0
   *     }, {
   *         "_id": "5ab283b342949f000857b8f9",
   *         "updatedAt": "2018-03-21T16:09:23.542Z",
   *         "createdAt": "2018-03-21T16:09:23.542Z",
   *         "user": {...},
   *         "course": {...},
   *         "notificationType": "allChanges",
   *         "emailNotification": false,
   *         "__v": 0
   *     ]}
   */
  @Authorized(['student', 'teacher', 'admin'])
  @Get('/user/:id')
  async getNotificationSettingsPerUser(@Param('id') id: string) {
    const notificationSettings: INotificationSettingsModel[] = await NotificationSettings.find({'user': id})
      .populate('user')
      .populate('course');
    return notificationSettings.map(settings => {
      return settings.toObject();
    });
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
   * @apiParam {INotificationSettings} notificationSettings New notification settings.
   *
   * @apiSuccess {INotificationSettingsModel} settings Updated notification settings.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "_id": "5ab283b342949f000857b8f9",
   *         "updatedAt": "2018-03-21T16:09:23.542Z",
   *         "createdAt": "2018-03-21T16:09:23.542Z",
   *         "user": {...},
   *         "course": {...},
   *         "notificationType": "allChanges",
   *         "emailNotification": true,
   *         "__v": 0
   *     }
   *
   * @apiError BadRequestError notification needs fields course and user
   */
  @Authorized(['student', 'teacher', 'admin'])
  @Put('/:id')
  async updateNotificationSettings(@Param('id') id: string, @Body() notificationSettings: INotificationSettings) {
    if (!notificationSettings.course || !notificationSettings.user) {
      throw new BadRequestError('notification needs fields course and user');
    }
    const settings: INotificationSettingsModel =
      await NotificationSettings.findOneAndUpdate({'_id': id}, notificationSettings, {new: true});
    return settings.toObject();
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
   * @apiSuccess {INotificationSettingsModel} settings Created notification settings.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "_id": "5ab283b342949f000857b8f9",
   *         "updatedAt": "2018-03-21T16:09:23.542Z",
   *         "createdAt": "2018-03-21T16:09:23.542Z",
   *         "user": {...},
   *         "course": {...},
   *         "notificationType": "allChanges",
   *         "emailNotification": true,
   *         "__v": 0
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
    return settings.toObject();
  }


}
