import {IUser} from '../../../shared/models/IUser';
import {Course} from '../models/Course';

export class WhitelistUpdater {

  /**
   * Add new user to all whitelistet courses in example after registration.
   * @param {IUser} user
   * @returns {Promise<void>}
   */
  public async addWhitelistetUserToCourses(user: IUser) {
    const courses = await Course.find(
      {enrollType: 'whitelist'}).populate('whitelist');

    await Promise.all(
      courses.map(async (course) => {
        if (course.students.findIndex(u => user._id === u._id < 0)
          && course.whitelist.find(w =>
            w.firstName === user.profile.firstName.toLowerCase() &&
            w.lastName === user.profile.lastName.toLowerCase() &&
            w.uid === user.uid)
        ) {
          course.students.push(user);
          await Course.update({_id: course._id}, course);
        }
      }));
  }
}
