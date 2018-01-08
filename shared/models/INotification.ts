import {IUser} from './IUser';

export interface INotification {
  _id: any;
  user: IUser;
  text: string;
}
