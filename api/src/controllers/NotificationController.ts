import {BadRequestError, Body, Get, JsonController, Param, Post, UseBefore} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {Notification} from '../models/Notification';

@JsonController('/notification')
@UseBefore(passportJwtMiddleware)
export class NotificationController {

  @Get('/user/:id')
  async getNotificationsPerUser(@Param('id') id: string) {
    const notifications = await Notification.find({'user': id});
    return notifications;
  }

  @Get('/course/:id')
  async getNotificationsPerCourse(@Param('id') id: string) {
    const notifications = await Notification.find({'course': id});
    return notifications;
  }

  @Post('/')
  async createNotification(@Body() data: any) {
    if (!data.course || !data.user) {
      throw new BadRequestError('notification needs fields course and user')
    }
  }
}
