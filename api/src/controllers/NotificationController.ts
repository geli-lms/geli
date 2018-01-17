import {BadRequestError, Body, Get, InternalServerError, JsonController, Param, Post, UseBefore} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {
  NotificationSettings, API_NOTIFICATION_TYPE_NONE,
  API_NOTIFICATION_TYPE_CHANGES_WITH_RELATIONIONSHIP, API_NOTIFICATION_TYPE_ALL_CHANGES,
} from '../models/NotificationSettings';
import {Notification} from '../models/Notification';

@JsonController('/notifications')
@UseBefore(passportJwtMiddleware)
export class NotificationController {


  @Get('/user/:id')
  async getNotifications(@Param('id') id: string) {
    const notifications = await Notification.find({'user': id})
      .populate('user')
      .populate('changedCourse')
      .populate('changedLecture')
      .populate('changedUnit');
    return notifications.map(notification => {return notification.toObject()});

  }
  /**
   * the body must contain the following data: the course (incl. students), a text message for the notification
   * @param data
   * @returns {Promise<void>}
   */
  @Post('/')
  async notifyStudents(@Body() data: any) {
    if (!data.course || !data.course.students) {
      throw new BadRequestError('Notification needs a course that has students to notify');
    }
    const students = data.course.students;
    try {
      for (const stud of students) {
        const notificationSettings = await NotificationSettings.findOne({'user': stud._id, 'course': data.course._id});

      }
    } catch (err) {
      const newError = new InternalServerError('Failed to notify students');
      newError.stack += '\nCaused by: ' + err.message + '\n' + err.stack;
      throw newError;
    }
  }
}
