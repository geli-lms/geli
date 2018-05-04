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
  public static sortAlphabetically<T extends {[k: string]: string}, K extends keyof T>(array: T[], key: K) {
    array.sort((objectA: T, objectB: T) => {
      const nameA = objectA[key].toLowerCase();
      const nameB = objectB[key].toLowerCase();
      return (nameA < nameB) ? -1 : ((nameA > nameB) ? 1 : 0);
    });
  }

  public static sortCoursesByName(courses: {name: string}[]) {
    this.sortAlphabetically(courses, 'name');
  }

  public static sortByLastVisitedCourses(courses, lastVisitedCourses) {
    courses.sort((a, b) => {
      const posA = lastVisitedCourses.indexOf(a._id);
      const posB = lastVisitedCourses.indexOf(b._id);
      if (posA === -1 && posB === -1) {
        return 0;
      }
      if (posA === -1) {
        return 1;
      }
      if (posB === -1) {
        return -1;
      }
      if (posA < posB) {
        return -1;
      }
      if (posA > posB) {
        return 1;
      }
      return 0;
    });
    return courses;
  }
}

