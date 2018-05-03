import {IUser} from './IUser';

export interface IMessage {
  author: IUser;
  content: string;
  visible: boolean;
  chatId: string;
}
