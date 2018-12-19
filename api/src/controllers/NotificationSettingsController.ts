import {Authorized, BodyParam, Get, JsonController, Put, UseBefore, CurrentUser} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {NotificationSettings} from '../models/NotificationSettings';
import {IUser} from '../../../shared/models/IUser';

@JsonController('/notificationSettings')
@UseBefore(passportJwtMiddleware)
export class NotificationSettingsController {

  /**
   * @api {get} /api/notificationSettings/ Get own notification settings for all courses
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
   * @api {put} /api/notificationSettings/ Set notification settings for a course (i.e. create or update them)
   * @apiName PutNotificationSettings
   * @apiGroup NotificationSettings
   * @apiPermission student
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {String} course ID of the course for which notification settings are to be set.
   * @apiParam {String} notificationType New value for the primary notification setting (none/relatedChanges/allChanges).
   * @apiParam {String} emailNotification New value for the email notification setting.
   *
   * @apiSuccess {Object} result Empty object.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {}
   */
  @Authorized(['student', 'teacher', 'admin'])
  @Put('/')
  async putNotificationSettings(@BodyParam('course', {required: true}) course: string,
                                @BodyParam('notificationType', {required: true}) notificationType: string,
                                @BodyParam('emailNotification', {required: true}) emailNotification: string,
                                @CurrentUser() currentUser: IUser) {
    await NotificationSettings.findOneAndUpdate(
        {user: currentUser, course},
        {user: currentUser, course, notificationType, emailNotification},
        {new: true, upsert: true});
    return {};
  }
}
