import {Authorized, BadRequestError, Body, Get, JsonController, Param, Post, Put, UseBefore} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {API_NOTIFICATION_TYPE_ALL_CHANGES, INotificationSettingsModel, NotificationSettings} from '../models/NotificationSettings';
import {INotificationSettings} from '../../../shared/models/INotificationSettings';

@JsonController('/notificationSettings')
@UseBefore(passportJwtMiddleware)
export class NotificationSettingsController {

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

  @Authorized(['student', 'teacher', 'admin'])
  @Put('/:id')
  async updateNotificationSettings(@Param('id') id: string, @Body() notificationSettings: INotificationSettings) {
    if (!notificationSettings) {
      throw new BadRequestError('notification needs fields course and user')
    }
    const settings: INotificationSettingsModel =
      await NotificationSettings.findOneAndUpdate({'_id': id}, notificationSettings, {new: true});
    return settings.toObject();
  }

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
