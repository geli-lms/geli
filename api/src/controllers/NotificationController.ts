import {BadRequestError, Body, InternalServerError, JsonController, Post, UseBefore} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {
  NotificationSettings, API_NOTIFICATION_TYPE_NONE,
  API_NOTIFICATION_TYPE_CHANGES_WITH_RELATIONIONSHIP, API_NOTIFICATION_TYPE_ALL_CHANGES,
} from '../models/NotificationSettings';
import {Notification} from '../models/Notification';

@JsonController('/notification')
@UseBefore(passportJwtMiddleware)
export class NotificationController {

  /**
   * the body must contain the following data: the course (incl. students), a text message for the notification
   * @param data
   * @returns {Promise<void>}
   */
  @Post('/')
  async notifyAllEnrolledStudents(@Body() data: any) {
    if (!data.course || !data.course.students) {
      throw new BadRequestError('Notification needs a course that has students to notify');
    }
    const students = data.course.students;
    try {
      for (const stud of students) {
        const notificationSettings = await NotificationSettings.findOne({'user': stud._id, 'course': data.course._id});
        if (!notificationSettings.notificationType) {
          notificationSettings.notificationType = API_NOTIFICATION_TYPE_NONE;
        }
        if (notificationSettings.notificationType === API_NOTIFICATION_TYPE_CHANGES_WITH_RELATIONIONSHIP) {
          // something should happen here
        }
        if (notificationSettings.notificationType === API_NOTIFICATION_TYPE_ALL_CHANGES) {
          // something should happen here
          new Notification({'user': stud._id, 'text': data.text}).save();
        }
      }
    } catch (err) {
      const newError = new InternalServerError('Failed to notify students');
      newError.stack += '\nCaused by: ' + err.message + '\n' + err.stack;
      throw newError;
    }
  }
}
