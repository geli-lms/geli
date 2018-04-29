import {IUserSubSafeBase} from './IUserSubSafeBase';

/**
 * This interface is currently needed because a pure safe subset of IUser
 * (i.e. IUserSubSafeBase) can't contain the email field, but the frontend
 * requires that to compute the hash as part of the gravatar URL.
 * Thus we compute the hash in the backend and have this additional interface.
 *
 * For simplification we may later choose to always precompute the hash
 * and only keep "IUserSubSafeBase", perhaps renamed to "IUserSubSafe".
 */
export interface IUserSubSafe extends IUserSubSafeBase {
  gravatar: string;
}
