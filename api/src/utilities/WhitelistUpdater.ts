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
    // TODO: It should work with $elemMatch!
    const courses = await Course.find(
      {enrollType: 'whitelist'}).populate('whitelist');
    await Promise.all(
      courses.map(async (course) => {
        if (course.students.findIndex(u => user._id === u._id) < 0
          && course.whitelist.findIndex(w =>
            w.firstName === user.profile.firstName.toLowerCase() &&
            w.lastName === user.profile.lastName.toLowerCase() &&
            w.uid === user.uid) >= 0
        ) {
          course.students.push(user);
          await Course.update({_id: course._id}, course);
        }
      }));
  }
}
