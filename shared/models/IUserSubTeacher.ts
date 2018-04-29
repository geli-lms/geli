import {IUserSubSafeBase} from './IUserSubSafeBase';

/**
 * Subset of IUser that any logged-in teacher (or equivalent) may see.
 * Superset of IUserSubSafeBase.
 */
export interface IUserSubTeacher extends IUserSubSafeBase {
  uid: string;
  email: string;
}
