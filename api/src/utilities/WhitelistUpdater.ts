import {IUser} from '../../../shared/models/IUser';
import {Course, ICourseModel} from '../models/Course';
import {IWhitelistUser} from '../../../shared/models/IWhitelistUser';
import {ICourse} from '../../../shared/models/ICourse';

export class WhitelistUpdater {

  /**
   * Add new user to all whitelistet courses in example after registration.
   * @param {IUser} user
   * @returns {Promise<void>}
   */
  public async addWhitelistetUserToCourses(user: IUser) {
    const courses = await Course.find(
      {
        'whitelist.firstName': user.profile.firstName.toLowerCase(),
        'whitelist.lastName': user.profile.lastName.toLowerCase(),
        'whitelist.uid': user.uid
      });
    await Promise.all(
      courses.map(async (course) => {
        course.students.push(user);
        await Course.update({_id: course._id}, course);
      }));
  }
}
