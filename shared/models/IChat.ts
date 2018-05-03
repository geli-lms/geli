import {IMessage} from './IMessage';

export interface IChat {
  name: string;
  description: string;
  messages: IMessage[];
  room: any;  // course, Lecture or unit
}
