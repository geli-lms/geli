import {IMessage} from './IMessage';

export interface IChat {
  name: string;
  anonymous: boolean,
  description: string;
  messages: IMessage[];
  room: any;  // course, Lecture or unit
}
