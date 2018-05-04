import {IUserSubSafe} from './IUserSubSafe';

/**
 * Subset of IUser for use in ICourseView.
 * Superset of IUserSubSafe.
 */
export interface IUserSubCourseView extends IUserSubSafe {
  email: string;
}
