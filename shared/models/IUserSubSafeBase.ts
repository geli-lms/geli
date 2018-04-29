import {IFile} from './IFile';

/**
 * Safe subset of IUser that any logged-in user may see.
 */
export interface IUserSubSafeBase {
  _id: any;
  profile: {
    firstName: string,
    lastName: string;
    picture?: IFile;
  };
}
