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
}

