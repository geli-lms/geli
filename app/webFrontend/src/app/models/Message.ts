import {IMessage} from '../../../../../shared/models/IMessage';
import {IUser} from '../../../../../shared/models/IUser';

export class Message implements IMessage {
  author: IUser;
  content: string;
  visible: boolean;
  room: string;
  chatName: string;

  constructor(author,chatName, content, room, visible){
    this.author = author;
    this.content = content;
    this.chatName = chatName;
    this.room = room;
    this.visible = visible;
  }
}
