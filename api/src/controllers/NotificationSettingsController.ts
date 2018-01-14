import {BadRequestError, Body, Get, JsonController, Param, Post, Put, UseBefore} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {NotificationSettings} from '../models/NotificationSettings';
import {INotificationSettings} from '../../../shared/models/INotificationSettings';

@JsonController('/notificationSettings')
@UseBefore(passportJwtMiddleware)
export class NotificationSettingsController {

  @Get('/user/:id')
  async getNotificationSettingsPerUser(@Param('id') id: string) {
    const notificationSettings = await NotificationSettings.find({'user': id});
    return notificationSettings;
  }

  @Put('/:id')
  async updateNotificationSettings(@Param('id') id: string, @Body() notificationSettings: INotificationSettings) {
    if (!notificationSettings) {
      throw new BadRequestError('notification needs fields course and user')
    }
    return NotificationSettings.findOneAndUpdate({'_id': id}, notificationSettings, {new: true});
  }

  @Post('/')
  async createNotificationSettings(@Body() data: any) {
    if (!data.userId || !data.courseId || !data.notificationType) {
      throw new BadRequestError('NotificationSettings need courseId, userId and notificationType');
    }
    const notificationSettings = await NotificationSettings.findOne({'user': data.userId, 'course': data.courseId});
    if (notificationSettings) {
      throw new BadRequestError('NotificationSettings for user:' + data.userId + ' with course: ' + data.courseId + ' already exist');
    }
    return new NotificationSettings({'user': data.userId, 'course': data.courseId, 'notificationType': data.notificationType}).save();
  }


}
