import {BadRequestError, Body, Get, JsonController, Param, Post, UseBefore} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {NotificationSettings} from '../models/NotificationSettings';
import {IUser} from '../../../shared/models/IUser';

@JsonController('/notificationSettings')
@UseBefore(passportJwtMiddleware)
export class NotificationSettingsController {

  @Get('/user/:id')
  async getNotificationsPerUser(@Param('id') id: string) {
    const notifications = await NotificationSettings.find({'user': id});
    return notifications;
  }

  @Get('/course/:id')
  async getNotificationsPerCourse(@Param('id') id: string) {
    const notifications = await NotificationSettings.find({'course': id});
    return notifications;
  }

  @Post('/')
  async createNotification(@Body() data: any) {
    if (!data.course || !data.user) {
      throw new BadRequestError('notification needs fields course and user')
    }
  }


}
