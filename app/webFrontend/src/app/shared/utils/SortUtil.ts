import {IUser} from '../../../../../../shared/models/IUser';

/**
 * Created by Alexander on 08.06.2017.
 */
export class SortUtil {

  public static sortUsers(users: IUser[]): number {
    users.sort(function (a, b) {
      if (a.profile.firstName < b.profile.firstName || a.profile.lastName < b.profile.lastName) {
        return -1;
      }
      if (a.profile.firstName > b.profile.firstName || a.profile.lastName < b.profile.lastName) {
        return 1;
      }
    });
    return 0;
  }

  public static sortByLastVisitedCourses(courses, lastVisitedCourses) {
    courses.map(course => course.position = 1000);
    lastVisitedCourses.map((id, index) => {
      const currentCourse = courses.find(course => course._id === id);
      if (currentCourse) {
        currentCourse.position = index;
      }
    });
    courses.sort((a, b) => {
      if (a.position < b.position) {
        return -1;
      }
      if (a.position > b.position) {
        return 1;
      }
      return 0;
    });
    courses.map(course  => delete course.position);
    return courses;
  }
}

