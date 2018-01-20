import {
  Authorized, BadRequestError, Body, CurrentUser, Delete, ForbiddenError, Get, InternalServerError, JsonController, NotFoundError, Param,
  Post, Req,
  UseBefore
} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {
  NotificationSettings, API_NOTIFICATION_TYPE_NONE,
  API_NOTIFICATION_TYPE_CHANGES_WITH_RELATIONIONSHIP, API_NOTIFICATION_TYPE_ALL_CHANGES,
} from '../models/NotificationSettings';
import {Notification} from '../models/Notification';
import {Course} from '../models/Course';
import {User} from '../models/User';
import {IUser} from '../../../shared/models/IUser';
import {ICourse} from '../../../shared/models/ICourse';
import {ILecture} from '../../../shared/models/ILecture';
import {IUnit} from '../../../shared/models/units/IUnit';
import {INotification} from '../../../shared/models/INotification';
import {Request} from 'express';

@JsonController('/notification')
@UseBefore(passportJwtMiddleware)
export class NotificationController {


  @Authorized(['student', 'teacher', 'admin'])
  @Post('/')
  async createNotifications(@Body() data: any, @Req() request: Request) {
    console.warn('data-course:' + data.changedCourse);
    console.warn('data-courseID:' + data.changedCourse._id);
    console.warn('data-course-text:' + data.text);

    if (!data.changedCourse || !data.text) {
      throw new BadRequestError('Notification needs at least the fields course  and text');
    }
    // user: IUser, changedCourse: ICourse, text: string, changedLecture?: ILecture, changedUnit?: IUnit
    const course = await Course.findById(data.changedCourse._id);
    course.students.forEach( student => {
      Notification.schema.statics.createNotification(
        student, data.changedCourse, data.text, data.changedLecture, data.changedUnit);
    });
    return {notified: true};
  }

  @Authorized(['student', 'teacher', 'admin'])
  @Get('/user/:id')
  async getNotifications(@Param('id') id: string) {
    const notifications = await Notification.find({'user': id})
      .populate('user')
      .populate('changedCourse')
      .populate('changedLecture')
      .populate('changedUnit');
    return notifications.map(notification => {return notification.toObject()});

  }



  @Authorized(['student', 'teacher', 'admin'])
  @Delete('/:id')
  async deleteNotification(@Param('id') id: string, @CurrentUser() currentUser: IUser) {
    const notification = await Notification.findOne( {_id : id} ).populate('user');
    if ( !notification ) {
      throw new NotFoundError();
    }
    if (notification.user._id.equals(currentUser._id)) {
      await notification.remove();
      return {result: true};
    } else {
      throw new ForbiddenError('Forbidden!');
    }
  }
}
