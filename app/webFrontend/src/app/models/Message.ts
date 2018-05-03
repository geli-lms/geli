import {IMessage} from '../../../../../shared/models/IMessage';
import {IUser} from '../../../../../shared/models/IUser';

export class Message implements IMessage {
  author: IUser;
  content: string;
  visible: boolean;
  room: string;

  constructor(author, content, room, visible){
    this.author = author;
    this.content = content;
    this.room = room;
    this.visible = visible;
  }
}
