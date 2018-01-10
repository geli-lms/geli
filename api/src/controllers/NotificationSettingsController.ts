import {BadRequestError, Body, Get, JsonController, Param, Post, Put, UseBefore} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {NotificationSettings} from '../models/NotificationSettings';

@JsonController('/notificationSettings')
@UseBefore(passportJwtMiddleware)
export class NotificationSettingsController {

  @Get('/user/:id')
  async getNotificationSettingsPerUser(@Param('id') id: string) {
    const notificationSettings = await NotificationSettings.find({'user': id});
    return notificationSettings;
  }

  @Put('/')
  async updateSettings(@Body() data: any) {
    if (!data.notificationSettings) {
      throw new BadRequestError('notification needs fields course and user')
    }
    return await NotificationSettings.findOneAndUpdate({'user:': data.notificationSettings.user._id,
        'course': data.notificationSettings.course._id}, data.notificationSettings, {new: true});
  }


}
