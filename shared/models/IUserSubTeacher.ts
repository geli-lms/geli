import {IUserSubSafe} from './IUserSubSafe';

/**
 * Subset of IUser that any logged-in teacher (or equivalent) may see.
 * Superset of IUserSubSafe.
 */
export interface IUserSubTeacher extends IUserSubSafe {
  uid: string;
  email: string;
}
