import {IUser} from './IUser';

export interface IUserSearchMeta {
  meta: {count: number};
  users: IUser[];
}
