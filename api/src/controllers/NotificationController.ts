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
import {SendMailOptions} from 'nodemailer';
import emailService from '../services/EmailService';

@JsonController('/notification')
@UseBefore(passportJwtMiddleware)
export class NotificationController {


  @Authorized(['teacher', 'admin'])
  @Post('/')
  async createNotifications(@Body() data: any, @Req() request: Request) {
    if (!data.changedCourse || !data.text) {
      throw new BadRequestError('Notification needs at least the fields course and text');
    }
    const course = await Course.findById(data.changedCourse._id);
    await Promise.all(course.students.map(async student => {
      await this.createNotification(student, data.text, data.changedCourse, data.changedLecture, data.changedUnit);
    }));
    return {notified: true};
  }

  @Authorized(['teacher', 'admin'])
  @Post('/user/:id')
  async createNotificationForStudent(@Param('id') userId: string, @Body() data: any) {
    const user = await User.findById(userId);
    await this.createNotification(user, data.text, data.changedCourse, data.changedLecture, data.changedUnit)
    return {notified: true};
  }

  async createNotification(user: IUser, text: string, changedCourse?: ICourse, changedLecture?: ILecture, changedUnit?: IUnit) {
    try {
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
          return notification.save();
        }
      } else {
        return notification.save();
      }
    } catch (err) {
      const newError = new InternalServerError('Failed to create notification');
      newError.stack += '\nCaused by: ' + err.message + '\n' + err.stack;
      throw newError;
    }
  }

  async getOrCreateSettings(user: IUser, changedCourse: ICourse) {
    let settings = await NotificationSettings.findOne({'user': user, 'course': changedCourse});
    if (settings === undefined || settings === null) {
      settings = await new NotificationSettings(
        {
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

  @Authorized(['student', 'teacher', 'admin'])
  @Get('/user/:id')
  async getNotifications(@Param('id') id: string) {
    const notifications = await Notification.find({'user': id})
      .populate('user')
      .populate('changedCourse')
      .populate('changedLecture')
      .populate('changedUnit');
    return notifications.map(notification => {
      return notification.toObject()
    });

  }

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
